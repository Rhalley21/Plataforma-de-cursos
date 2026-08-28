# 🤖 INETRIS FINANÇAS

Agente de IA financeiro: envia cobranças e lembretes de pagamento via **WhatsApp Business API (Twilio)**,
com links de pagamento gerados pela **InfinityPay**, e usa a **API da Anthropic (Claude)** para redigir
mensagens personalizadas (com fallback automático para templates prontos caso a IA esteja indisponível).

## O que o agente faz

1. **Cria a cobrança** (via API) e gera automaticamente o link de pagamento na InfinityPay.
2. **Envia a primeira mensagem** no WhatsApp do cliente com o link.
3. Todos os dias, um **agendador (cron)** verifica as cobranças pendentes e:
   - Envia um **lembrete** X dias antes do vencimento (`DIAS_LEMBRETE_ANTES`);
   - Envia um aviso **no dia do vencimento**;
   - Envia cobranças de **atraso** em intervalos (1, 3, 7, 15, 30 dias);
4. Ao receber o **webhook de pagamento confirmado** da InfinityPay, marca a cobrança como paga
   e envia uma **mensagem de agradecimento** automaticamente.
5. Responde mensagens simples recebidas no WhatsApp (ex: "já paguei", "quero negociar").

## ⚠️ Antes de rodar em produção

- **InfinityPay**: não tive acesso à documentação atualizada no momento em que este código foi gerado.
  O arquivo `src/services/infinityPay.js` traz minha melhor estimativa do endpoint/payload de criação
  de link de pagamento, **mas você precisa confirmar em https://developers.infinitepay.io** (ou no painel
  da sua conta) o endpoint exato, os nomes dos campos e o formato do webhook de confirmação de pagamento,
  e ajustar o arquivo conforme necessário. Deixei um fallback (link estático da conta) para o fluxo não
  travar caso o endpoint dinâmico precise de ajuste.
- **Twilio WhatsApp**: fora da janela de 24h após a última mensagem do cliente, o WhatsApp exige o uso de
  **Templates (HSM)** pré-aprovados pela Meta para iniciar a conversa. Use `sendTemplate()` em
  `src/services/whatsapp.js` para esses casos (cadastre os templates no Twilio Content API/Console e
  coloque os SIDs no `.env`).
- **Modelo Claude**: o modelo usado (`claude-sonnet-5`) está configurado em `src/config.js`. Confirme o
  nome do modelo atual em https://docs.claude.com antes de ir para produção.

## Instalação

```bash
cd inetris-financas
npm install
cp .env.example .env
# edite o .env com suas credenciais reais
npm start
```

O servidor sobe em `http://localhost:3000` (ou a porta definida em `PORT`).

## Configuração das credenciais (.env)

| Variável | Descrição |
|---|---|
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` | Credenciais da sua conta Twilio |
| `TWILIO_WHATSAPP_FROM` | Número aprovado, formato `whatsapp:+14155238886` |
| `INFINITYPAY_HANDLE` | Seu handle na InfinityPay (aparece no link de checkout) |
| `INFINITYPAY_API_KEY` | Chave de API, se aplicável à sua conta |
| `ANTHROPIC_API_KEY` | Chave da API da Anthropic (para o agente redigir mensagens) |
| `AGENT_USE_AI` | `true`/`false` — desliga a IA e usa só os templates prontos |
| `DIAS_LEMBRETE_ANTES` | Quantos dias antes do vencimento enviar lembrete |
| `CRON_DIARIO` | Expressão cron da varredura diária (padrão: 9h da manhã) |

## Endpoints da API

### Criar uma cobrança (gera link + envia WhatsApp automaticamente)

```bash
curl -X POST http://localhost:3000/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": { "nome": "Maria Silva", "telefone": "+5511999998888" },
    "descricao": "Mensalidade de setembro",
    "valorCentavos": 15000,
    "vencimento": "2026-09-10"
  }'
```

### Listar cobranças

```bash
curl http://localhost:3000/invoices
curl "http://localhost:3000/invoices?status=pendente"
```

### Webhooks a configurar externamente

- **Twilio** → `POST https://SEU_DOMINIO/webhooks/whatsapp` (em "When a message comes in")
- **InfinityPay** → `POST https://SEU_DOMINIO/webhooks/infinitypay` (no painel de webhooks da conta)

## Estrutura do projeto

```
src/
├── index.js                  # servidor Express
├── config.js                 # variáveis de ambiente centralizadas
├── db.js                     # banco simples em JSON (troque por Postgres/Mongo se precisar escalar)
├── agent/
│   ├── persona.js             # system prompt da INETRIS FINANÇAS
│   └── messageComposer.js     # gera texto via Claude, com fallback de template
├── services/
│   ├── whatsapp.js            # envio/recebimento via Twilio WhatsApp API
│   └── infinityPay.js         # criação de link de pagamento + validação de webhook
├── templates/
│   └── messages.js            # templates prontos em PT-BR (fallback sem IA)
├── jobs/
│   └── scheduler.js           # cron diário: lembretes, vencimento, atraso
├── routes/
│   ├── invoices.js            # criar/listar cobranças
│   ├── whatsappWebhook.js     # respostas automáticas a mensagens recebidas
│   └── paymentWebhook.js      # confirmação de pagamento -> agradecimento automático
└── models/
    └── Invoice.js             # CRUD da cobrança no banco JSON
```

## Próximos passos sugeridos

- Trocar o banco JSON por um banco de verdade (Postgres/MySQL) quando o volume crescer.
- Adicionar autenticação nos endpoints `/invoices` (hoje estão abertos).
- Cadastrar Templates (HSM) aprovados pela Meta para reengajar clientes fora da janela de 24h.
- Adicionar logs/observabilidade (ex: Sentry) para acompanhar falhas de envio.
