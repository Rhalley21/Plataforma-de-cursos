const express = require('express');
const whatsapp = require('../services/whatsapp');
const Invoice = require('../models/Invoice');

const router = express.Router();

/**
 * POST /webhooks/whatsapp
 * Configure esta URL no Twilio Console (Sandbox ou número WhatsApp aprovado)
 * em "When a message comes in".
 *
 * Trata respostas simples do cliente, ex: "já paguei", "quero negociar".
 * Para algo mais sofisticado (intenção via IA), plugue o messageComposer/Anthropic aqui.
 */
router.post('/', async (req, res) => {
  const { from, text } = whatsapp.parseInboundMessage(req.body);
  const textoNormalizado = text.toLowerCase();

  const cobrancasDoCliente = Invoice.listar().filter(
    (inv) => inv.cliente.telefone === from && inv.status !== 'pago'
  );

  let resposta =
    'Obrigado pela mensagem! Nossa equipe financeira vai analisar e te retornar em breve. 🙂';

  if (textoNormalizado.includes('já paguei') || textoNormalizado.includes('ja paguei')) {
    resposta =
      'Obrigado por avisar! Vamos confirmar o pagamento em nosso sistema e atualizamos você em breve. ✅';
  } else if (textoNormalizado.includes('negociar')) {
    resposta =
      'Sem problemas! Vou te colocar em contato com um atendente para conversarmos sobre as opções de negociação. 🙋';
  } else if (cobrancasDoCliente.length > 0) {
    const proxima = cobrancasDoCliente[0];
    resposta = `Você tem uma cobrança em aberto: *${proxima.descricao}*.\nLink de pagamento: ${proxima.linkPagamento}`;
  }

  await whatsapp.sendText(from, resposta);

  // Twilio espera uma resposta 200 (pode ser TwiML vazio ou apenas status 200)
  res.status(200).send('<Response></Response>');
});

module.exports = router;
