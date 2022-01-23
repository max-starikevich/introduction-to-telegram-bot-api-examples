import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

import { resolveHostname } from "../hostnameResolver";

dotenv.config();

const token = process.env.POLLING_BOT_TOKEN;

async function startBot() {
  if (!token) {
    throw new Error("Missing POLLING_BOT_TOKEN.");
  }

  const bot = new Telegraf(token);

  bot.command("/start", (ctx) => {
    ctx.reply("Hello! Write any hostname to get its IP address.");
  });

  bot.on("text", async (ctx) => {
    const message = ctx.update.message.text;
    const ip = await resolveHostname(message);

    ctx.reply(ip || `Cannot resolve this hostname`);
  });

  await bot.launch();

  console.info(`🚀 Bot is online (Telegraf + Polling)`);
}

startBot();
