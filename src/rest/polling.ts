import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const token = process.env.POLLING_BOT_TOKEN;

async function startBot() {
  if (!token) {
    throw new Error("Missing POLLING_BOT_TOKEN.");
  }

  console.info(`🚀 Bot is online (REST API + Polling)`);

  const client = axios.create({
    baseURL: `https://api.telegram.org/bot${token}`,
    timeout: 5000,
  });

  let offset = 0;

  while (true) {
    try {
      console.info("⌛ Getting updates.");

      const { data } = await client.get("/getUpdates", {
        params: {
          offset,
          limit: 1,
          allowed_updates: ["message"],
        },
      });

      const [update] = data?.result || [];

      if (!update) {
        continue;
      }

      offset = update.update_id + 1;

      if (!update.message.text) {
        continue;
      }

      const chatId = update.message.chat.id;

      console.info("🛫 Sending the message.");

      await client.post("/sendMessage", {
        chat_id: chatId,
        text: `${update.message.text.toUpperCase()} 🔥🔥🔥`,
      });
    } catch (e: any) {
      console.error(`❌ Update processing failed.`, e.message);
    }
  }
}

startBot();
