const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Invoice = require('../models/Invoice');
const infinityPay = require('../services/infinityPay');
const whatsapp = require('../services/whatsapp');
const messageComposer = require('../agent/messageComposer');

const router = express.Router();

/**
 * POST /invoices
 * Cria uma cobrança, gera o link de pagamento na InfinityPay
 * e já envia a primeira mensagem no WhatsApp do cliente.
 *
 * Body esperado:
 * {
 *   "cliente": { "nome": "Maria", "telefone": "+5511999998888" },
 *   "descricao": "Mensalidade de agosto",
 *   "valorCentavos": 15000,
 *   "vencimento": "2026-09-10"
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { cliente, descricao, valorCentavos, vencimento } = req.body;

    if (!cliente?.nome || !cliente?.telefone || !descricao || !valorCentavos || !vencimento) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: cliente.nome, cliente.telefone, descricao, valorCentavos, vencimento',
      });
    }

    const invoice = Invoice.criar({ cliente, descricao, valorCentavos, vencimento });

    const orderId = uuidv4();
    const { url } = await infinityPay.criarLinkPagamento({
      orderId,
      valorCentavos,
      descricao,
    });

    Invoice.atualizar(invoice.id, { linkPagamento: url, orderId });
    const invoiceAtualizada = Invoice.buscarPorId(invoice.id);

    const texto = await messageComposer.compor('novaCobranca', invoiceAtualizada);
    await whatsapp.sendText(cliente.telefone, texto);
    Invoice.registrarEnvio(invoice.id, 'novaCobranca');

    res.status(201).json(Invoice.buscarPorId(invoice.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Falha ao criar cobrança', detalhe: err.message });
  }
});

// GET /invoices?status=pendente
router.get('/', (req, res) => {
  const { status } = req.query;
  const filtro = status ? { status } : {};
  res.json(Invoice.listar(filtro));
});

router.get('/:id', (req, res) => {
  const invoice = Invoice.buscarPorId(req.params.id);
  if (!invoice) return res.status(404).json({ erro: 'Cobrança não encontrada' });
  res.json(invoice);
});

module.exports = router;
