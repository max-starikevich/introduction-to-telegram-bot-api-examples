# Introduction to Telegram Bot API examples

Create 2 new bots from BotFather: https://t.me/botfather and save both bot tokens.

Run Ngrok in a separate terminal:

```bash
$ ngrok http 4000
```

Prepare dependencies and the config:

```bash
$ npm install
$ cp .env.example .env # insert bot tokens and Ngrok URL
```

Run polling bots:

```bash
# classic example in the polling mode
$ npm run rest:polling

# Telegraf framework in the polling mode
$ npm run telegraf:polling
```

Run webhook bots:

```bash
# classic example in the webhook mode
$ npm run rest:webhook

# Telegraf framework in the webhook mode
$ npm run telegraf:webhook
```

Enjoy!
