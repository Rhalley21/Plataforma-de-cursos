const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config');
const { SYSTEM_PROMPT } = require('./persona');
const { templates, formatarMoeda, formatarData } = require('../templates/messages');

const anthropic = config.anthropic.apiKey ? new Anthropic({ apiKey: config.anthropic.apiKey }) : null;

/**
 * Gera o texto da mensagem para um determinado estágio de cobrança.
 * @param {'novaCobranca'|'lembrete'|'vencimentoHoje'|'atrasado'|'confirmacaoPagamento'} estagio
 * @param {Object} invoice
 * @param {Object} [extra] - dados adicionais (ex: { diasAtraso: 5 })
 */
async function compor(estagio, invoice, extra = {}) {
  // Sem IA configurada (ou desativada) -> usa template pronto
  if (!anthropic || !config.anthropic.useAI) {
    return templates[estagio](invoice, extra.diasAtraso);
  }

  const contexto = `
Estágio: ${estagio}
Cliente: ${invoice.cliente.nome}
Descrição da cobrança: ${invoice.descricao}
Valor: ${formatarMoeda(invoice.valorCentavos)}
Vencimento: ${formatarData(invoice.vencimento)}
Dias de atraso (se aplicável): ${extra.diasAtraso ?? 'não se aplica'}
Link de pagamento (use exatamente como está): ${invoice.linkPagamento}
`.trim();

  try {
    const response = await anthropic.messages.create({
      model: config.anthropic.model,
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: contexto }],
    });

    const texto = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    return texto || templates[estagio](invoice, extra.diasAtraso);
  } catch (err) {
    console.error('[Agente] Falha ao gerar mensagem com IA, usando template:', err.message);
    return templates[estagio](invoice, extra.diasAtraso);
  }
}

module.exports = { compor };
