const cron = require('node-cron');
const config = require('../config');
const Invoice = require('../models/Invoice');
const whatsapp = require('../services/whatsapp');
const messageComposer = require('../agent/messageComposer');

function diffDias(dataIso) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const data = new Date(dataIso);
  data.setHours(0, 0, 0, 0);
  return Math.round((data - hoje) / (1000 * 60 * 60 * 24));
}

async function processarCobrancas() {
  const pendentes = Invoice.listar().filter((inv) => !['pago', 'cancelado'].includes(inv.status));

  for (const invoice of pendentes) {
    const dias = diffDias(invoice.vencimento);

    try {
      if (dias === config.regras.diasLembreteAntes) {
        const texto = await messageComposer.compor('lembrete', invoice);
        await whatsapp.sendText(invoice.cliente.telefone, texto);
        Invoice.atualizar(invoice.id, { status: 'lembrado' });
        Invoice.registrarEnvio(invoice.id, 'lembrete');
      } else if (dias === 0) {
        const texto = await messageComposer.compor('vencimentoHoje', invoice);
        await whatsapp.sendText(invoice.cliente.telefone, texto);
        Invoice.registrarEnvio(invoice.id, 'vencimentoHoje');
      } else if (dias < 0) {
        const diasAtraso = Math.abs(dias);
        // Evita reenviar todo dia: só nos dias 1, 3, 7, 15, 30 de atraso
        if ([1, 3, 7, 15, 30].includes(diasAtraso)) {
          const texto = await messageComposer.compor('atrasado', invoice, { diasAtraso });
          await whatsapp.sendText(invoice.cliente.telefone, texto);
          Invoice.atualizar(invoice.id, { status: 'atrasado' });
          Invoice.registrarEnvio(invoice.id, 'atrasado');
        }
      }
    } catch (err) {
      console.error(`[Scheduler] Erro ao processar cobrança ${invoice.id}:`, err.message);
    }
  }
}

function iniciar() {
  cron.schedule(config.regras.cronDiario, () => {
    console.log('[Scheduler] Rodando varredura diária de cobranças...');
    processarCobrancas();
  });
  console.log(`[Scheduler] Agendado para: ${config.regras.cronDiario}`);
}

module.exports = { iniciar, processarCobrancas };
