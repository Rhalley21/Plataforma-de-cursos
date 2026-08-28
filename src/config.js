require('dotenv').config();

function required(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  return value;
}

module.exports = {
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,

  twilio: {
    accountSid: required('TWILIO_ACCOUNT_SID'),
    authToken: required('TWILIO_AUTH_TOKEN'),
    from: required('TWILIO_WHATSAPP_FROM'), // ex: whatsapp:+14155238886
    templateSidLembrete: process.env.TWILIO_TEMPLATE_SID_LEMBRETE || null,
    templateSidAtraso: process.env.TWILIO_TEMPLATE_SID_ATRASO || null,
  },

  infinityPay: {
    handle: required('INFINITYPAY_HANDLE'),
    apiKey: process.env.INFINITYPAY_API_KEY || null,
    webhookSecret: process.env.INFINITYPAY_WEBHOOK_SECRET || '',
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || null,
    useAI: (process.env.AGENT_USE_AI || 'true').toLowerCase() === 'true',
    // Verifique o nome do modelo atual em https://docs.claude.com antes de ir para produção
    model: 'claude-sonnet-5',
  },

  regras: {
    diasLembreteAntes: parseInt(process.env.DIAS_LEMBRETE_ANTES || '3', 10),
    cronDiario: process.env.CRON_DIARIO || '0 9 * * *',
  },
};
