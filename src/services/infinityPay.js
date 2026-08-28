const axios = require('axios');
const config = require('../config');

/**
 * ⚠️ IMPORTANTE — LEIA ANTES DE USAR EM PRODUÇÃO
 * ------------------------------------------------------------------
 * Não tenho acesso à internet neste momento para conferir a versão
 * mais atual da documentação oficial da InfinityPay
 * (https://developers.infinitepay.io). O código abaixo foi montado
 * com base no padrão conhecido da API pública de "Link de Pagamento"
 * da InfinityPay (endpoint de checkout dinâmico por handle da conta),
 * mas o nome exato do endpoint, os campos do payload e a forma de
 * autenticação podem ter mudado.
 *
 * Antes de colocar em produção:
 *   1. Abra https://developers.infinitepay.io (ou o painel da sua conta
 *      InfinityPay) e confirme o endpoint de criação de link de cobrança.
 *   2. Ajuste `criarLinkPagamento()` abaixo para bater com o payload real.
 *   3. Ajuste `validarWebhook()` conforme o mecanismo de assinatura que
 *      a InfinityPay realmente utiliza (header, HMAC, etc.).
 * ------------------------------------------------------------------
 */

const API_BASE = 'https://api.infinitepay.io';

/**
 * Cria um link de pagamento dinâmico (valor específico) para uma cobrança.
 * @param {Object} params
 * @param {string} params.orderId - Id único da cobrança no seu sistema (idempotência)
 * @param {number} params.valorCentavos - Valor em centavos (ex: 15000 = R$150,00)
 * @param {string} params.descricao - Descrição do item/cobrança
 * @param {string} [params.redirectUrl] - Para onde o cliente volta após pagar
 */
async function criarLinkPagamento({ orderId, valorCentavos, descricao, redirectUrl }) {
  const payload = {
    handle: config.infinityPay.handle,
    order_nsu: orderId,
    price: valorCentavos, // em centavos
    items: [
      {
        name: descricao,
        price: valorCentavos,
        quantity: 1,
      },
    ],
    redirect_url: redirectUrl || `${config.baseUrl}/pagamentos/obrigado`,
  };

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (config.infinityPay.apiKey) {
      headers.Authorization = `Bearer ${config.infinityPay.apiKey}`;
    }

    const { data } = await axios.post(
      `${API_BASE}/invoices/public/checkout/links`,
      payload,
      { headers }
    );

    // Campo de retorno também deve ser confirmado na documentação atual.
    const url = data.url || data.checkout_url || data.link;
    if (!url) {
      throw new Error('Resposta da InfinityPay não trouxe uma URL de checkout reconhecível.');
    }
    return { url, raw: data };
  } catch (err) {
    // Fallback: link estático da conta (sem valor pré-preenchido).
    // Útil para não travar o fluxo enquanto o endpoint dinâmico é validado.
    console.error('[InfinityPay] Falha ao criar link dinâmico, usando fallback estático:', err.message);
    return {
      url: `https://checkout.infinitepay.io/${config.infinityPay.handle}`,
      raw: null,
      fallback: true,
    };
  }
}

/**
 * Valida a assinatura de um webhook de pagamento da InfinityPay.
 * Ajuste conforme o mecanismo real (header específico, HMAC-SHA256, etc.)
 * documentado na sua conta.
 */
function validarWebhook(req) {
  const secret = config.infinityPay.webhookSecret;
  if (!secret) return true; // sem segredo configurado, não valida (defina em produção!)
  const assinaturaRecebida = req.headers['x-infinitepay-signature'];
  return Boolean(assinaturaRecebida) && assinaturaRecebida === secret;
}

module.exports = { criarLinkPagamento, validarWebhook };
