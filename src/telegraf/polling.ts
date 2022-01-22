import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

const token = process.env.POLLING_BOT_TOKEN;

async function startBot() {
  if (!token) {
    throw new Error("Missing POLLING_BOT_TOKEN.");
  }

  const bot = new Telegraf(token);

  bot.on("text", (ctx) => {
    console.info("🛫 Sending the message.");
    ctx.reply(`${ctx.update.message.text.toUpperCase()} 🔥🔥🔥`);
  });

  await bot.launch();

  console.info(`🚀 Bot is online (Telegraf + Polling)`);
}

startBot();
