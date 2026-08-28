const twilio = require('twilio');
const config = require('../config');

const client = config.twilio.accountSid
  ? twilio(config.twilio.accountSid, config.twilio.authToken)
  : null;

/**
 * Envia uma mensagem de texto livre via WhatsApp.
 * Só funciona dentro da janela de 24h após a última mensagem do cliente,
 * ou se o número já tiver "opt-in". Fora da janela, use sendTemplate().
 */
async function sendText(toPhoneE164, body) {
  if (!client) throw new Error('Twilio não configurado (verifique .env)');
  return client.messages.create({
    from: config.twilio.from,
    to: `whatsapp:${toPhoneE164}`,
    body,
  });
}

/**
 * Envia mensagem usando um Template (HSM) aprovado pela Meta.
 * Necessário para iniciar conversa fora da janela de 24h (ex: cobrança automática).
 * contentSid = SID do template no Twilio Content API.
 * contentVariables = { "1": "João", "2": "R$ 150,00", "3": "https://link..." }
 */
async function sendTemplate(toPhoneE164, contentSid, contentVariables = {}) {
  if (!client) throw new Error('Twilio não configurado (verifique .env)');
  return client.messages.create({
    from: config.twilio.from,
    to: `whatsapp:${toPhoneE164}`,
    contentSid,
    contentVariables: JSON.stringify(contentVariables),
  });
}

/**
 * Parser simples do webhook de mensagens recebidas do Twilio (formato x-www-form-urlencoded).
 * Configure no Twilio Console: "When a message comes in" -> https://SEU_DOMINIO/webhooks/whatsapp
 */
function parseInboundMessage(body) {
  return {
    from: (body.From || '').replace('whatsapp:', ''),
    text: (body.Body || '').trim(),
    messageSid: body.MessageSid,
  };
}

module.exports = { sendText, sendTemplate, parseInboundMessage };
