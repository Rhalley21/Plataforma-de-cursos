const express = require('express');
const infinityPay = require('../services/infinityPay');
const Invoice = require('../models/Invoice');
const whatsapp = require('../services/whatsapp');
const messageComposer = require('../agent/messageComposer');

const router = express.Router();

/**
 * POST /webhooks/infinitypay
 *
 * ⚠️ Confirme no painel da InfinityPay qual é o formato exato do payload
 * de notificação de pagamento (nome dos campos pode variar). Ajuste o
 * mapeamento abaixo (`orderId`, `status`) conforme a documentação atual.
 */
router.post('/', async (req, res) => {
  if (!infinityPay.validarWebhook(req)) {
    return res.status(401).json({ erro: 'Assinatura inválida' });
  }

  const orderId = req.body.order_nsu || req.body.orderId || req.body.nsu;
  const statusRecebido = (req.body.status || '').toLowerCase();

  const invoice = Invoice.listar().find((inv) => inv.orderId === orderId);
  if (!invoice) {
    return res.status(404).json({ erro: 'Cobrança correspondente não encontrada' });
  }

  const pago = ['paid', 'approved', 'pago', 'success'].includes(statusRecebido);

  if (pago && invoice.status !== 'pago') {
    Invoice.atualizar(invoice.id, { status: 'pago' });
    const invoiceAtualizada = Invoice.buscarPorId(invoice.id);
    const texto = await messageComposer.compor('confirmacaoPagamento', invoiceAtualizada);
    await whatsapp.sendText(invoice.cliente.telefone, texto);
    Invoice.registrarEnvio(invoice.id, 'confirmacaoPagamento');
  }

  res.status(200).json({ ok: true });
});

module.exports = router;
