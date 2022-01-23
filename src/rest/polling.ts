import * as dotenv from "dotenv";
import axios from "axios";

import { resolveHostname } from "../hostnameResolver";

dotenv.config();

const token = process.env.POLLING_BOT_TOKEN;

async function startBot() {
  if (!token) {
    throw new Error("Missing POLLING_BOT_TOKEN.");
  }

  console.info(`🚀 Bot is online (REST API + Polling)`);

  const telegramAPI = axios.create({
    baseURL: `https://api.telegram.org/bot${token}`,
    timeout: 5000,
  });

  let offset = 0;

  while (true) {
    try {
      const { data } = await telegramAPI.get("/getUpdates", {
        params: {
          offset,
          limit: 1,
        },
      });

      const [update] = data?.result || [];

      if (!update) {
        continue;
      }

      offset = update.update_id + 1;

      if (!update?.message?.text) {
        continue;
      }

      const chatId = update.message.chat.id;
      const message = update.message.text;

      if (message === "/start") {
        await telegramAPI.post("/sendMessage", {
          chat_id: chatId,
          text: "Hello! Write any hostname to get its IP address.",
        });

        continue;
      }

      const ip = await resolveHostname(message);

      await telegramAPI.post("/sendMessage", {
        chat_id: chatId,
        text: ip || `Cannot resolve this hostname`,
      });
    } catch (e: any) {
      console.error(`❌ Processing failed. Retrying.`, e.message);
    }
  }
}

startBot();
