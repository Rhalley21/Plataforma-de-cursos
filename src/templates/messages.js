function formatarMoeda(centavos) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

const templates = {
  lembrete: (invoice) => `Olá, ${invoice.cliente.nome}! 👋
Aqui é a *INETRIS FINANÇAS*.

Passando para lembrar que sua cobrança referente a *${invoice.descricao}* no valor de *${formatarMoeda(invoice.valorCentavos)}* vence em *${formatarData(invoice.vencimento)}*.

Pague com segurança pelo link abaixo:
${invoice.linkPagamento}

Qualquer dúvida, estou por aqui. 🙂`,

  vencimentoHoje: (invoice) => `Olá, ${invoice.cliente.nome}!
Sua cobrança de *${invoice.descricao}* (${formatarMoeda(invoice.valorCentavos)}) vence *hoje*.

Link para pagamento:
${invoice.linkPagamento}

Se já pagou, pode desconsiderar esta mensagem. ✅`,

  atrasado: (invoice, diasAtraso) => `Olá, ${invoice.cliente.nome}.
Identificamos que a cobrança *${invoice.descricao}* (${formatarMoeda(invoice.valorCentavos)}), vencida em ${formatarData(invoice.vencimento)}, ainda está em aberto (${diasAtraso} dia(s) de atraso).

Para regularizar, use o link abaixo:
${invoice.linkPagamento}

Se precisar negociar o pagamento, é só responder esta mensagem. Estamos aqui para ajudar.`,

  confirmacaoPagamento: (invoice) => `Recebemos a confirmação do seu pagamento de *${formatarMoeda(invoice.valorCentavos)}* referente a *${invoice.descricao}*. ✅

Muito obrigado! A *INETRIS FINANÇAS* agradece a confiança. 💙`,

  novaCobranca: (invoice) => `Olá, ${invoice.cliente.nome}! Aqui é a *INETRIS FINANÇAS*.

Segue o link de pagamento referente a *${invoice.descricao}*, no valor de *${formatarMoeda(invoice.valorCentavos)}*, com vencimento em *${formatarData(invoice.vencimento)}*:

${invoice.linkPagamento}

Qualquer dúvida, é só chamar por aqui.`,
};

module.exports = { templates, formatarMoeda, formatarData };
