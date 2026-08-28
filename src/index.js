const express = require('express');
const config = require('./config');
const scheduler = require('./jobs/scheduler');

const invoicesRouter = require('./routes/invoices');
const whatsappWebhookRouter = require('./routes/whatsappWebhook');
const paymentWebhookRouter = require('./routes/paymentWebhook');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Twilio envia webhooks como form-urlencoded

app.get('/', (_req, res) => {
  res.json({ agente: 'INETRIS FINANÇAS', status: 'online' });
});

app.use('/invoices', invoicesRouter);
app.use('/webhooks/whatsapp', whatsappWebhookRouter);
app.use('/webhooks/infinitypay', paymentWebhookRouter);

app.listen(config.port, () => {
  console.log(`🤖 INETRIS FINANÇAS rodando em http://localhost:${config.port}`);
  scheduler.iniciar();
});
