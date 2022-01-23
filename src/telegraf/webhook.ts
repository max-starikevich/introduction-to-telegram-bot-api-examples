import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

import { resolveHostname } from "../hostnameResolver";

dotenv.config();

const token = process.env.WEBHOOK_BOT_TOKEN;
const webhookURL = process.env.WEBHOOK_URL;
const port = process.env.PORT || "4000";

async function startBot() {
  if (!token) {
    throw new Error("Missing WEBHOOK_BOT_TOKEN.");
  }

  if (!webhookURL) {
    throw new Error("Missing WEBHOOK_URL.");
  }

  const webhookPath = `/webhook/${token}`;
  const fullWebhook = webhookURL + webhookPath;

  const bot = new Telegraf(token);

  bot.command("/start", (ctx) => {
    ctx.reply("Hello! Write any hostname to get its IP address.");
  });

  bot.on("text", async (ctx) => {
    const message = ctx.update.message.text;
    const ip = await resolveHostname(message);

    ctx.reply(ip || `Cannot resolve this hostname`);
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
