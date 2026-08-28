const { v4: uuidv4 } = require('uuid');
const db = require('../db');

/**
 * Estrutura de uma cobrança (invoice):
 * {
 *   id, cliente: { nome, telefone (E.164, ex: +5511999998888) },
 *   descricao, valorCentavos, vencimento (ISO date),
 *   status: 'pendente' | 'lembrado' | 'atrasado' | 'pago' | 'cancelado',
 *   linkPagamento, orderId, criadoEm, atualizadoEm,
 *   historicoEnvios: [{ tipo, data }]
 * }
 */

function criar({ cliente, descricao, valorCentavos, vencimento }) {
  const data = db.read();
  const invoice = {
    id: uuidv4(),
    cliente,
    descricao,
    valorCentavos,
    vencimento,
    status: 'pendente',
    linkPagamento: null,
    orderId: null,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
    historicoEnvios: [],
  };
  data.invoices.push(invoice);
  db.write(data);
  return invoice;
}

function listar(filtro = {}) {
  const data = db.read();
  return data.invoices.filter((inv) =>
    Object.entries(filtro).every(([k, v]) => inv[k] === v)
  );
}

function buscarPorId(id) {
  const data = db.read();
  return data.invoices.find((inv) => inv.id === id) || null;
}

function atualizar(id, patch) {
  const data = db.read();
  const idx = data.invoices.findIndex((inv) => inv.id === id);
  if (idx === -1) return null;
  data.invoices[idx] = {
    ...data.invoices[idx],
    ...patch,
    atualizadoEm: new Date().toISOString(),
  };
  db.write(data);
  return data.invoices[idx];
}

function registrarEnvio(id, tipo) {
  const data = db.read();
  const idx = data.invoices.findIndex((inv) => inv.id === id);
  if (idx === -1) return null;
  data.invoices[idx].historicoEnvios.push({ tipo, data: new Date().toISOString() });
  data.invoices[idx].atualizadoEm = new Date().toISOString();
  db.write(data);
  return data.invoices[idx];
}

module.exports = { criar, listar, buscarPorId, atualizar, registrarEnvio };
