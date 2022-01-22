import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

const token = process.env.WEBHOOK_BOT_TOKEN;
const webhookURL = process.env.WEBHOOK_URL;
const port = process.env.PORT || "4000";

async function startBot() {
  if (!token) {
    throw new Error("Missing POLLING_BOT_TOKEN.");
  }

  if (!webhookURL) {
    throw new Error("Missing WEBHOOK_URL.");
  }

  const webhookPath = `/webhook/${token}`;
  const fullWebhook = webhookURL + webhookPath;

  const bot = new Telegraf(token);

  bot.on("text", (ctx) => {
    console.info("🛫 Sending the message.");
    ctx.reply(`${ctx.update.message.text.toUpperCase()} 🔥🔥🔥`);
  });

  await bot.telegram.setWebhook(fullWebhook);

  await bot.launch({
    webhook: {
      hookPath: webhookPath,
      port: parseInt(port),
    },
  });

  console.info(`🚀 Bot is online (Telegraf + Webhook)`);
}

startBot();
