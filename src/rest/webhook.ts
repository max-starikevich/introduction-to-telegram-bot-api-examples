import * as dotenv from "dotenv";
import axios from "axios";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";

dotenv.config();

const token = process.env.WEBHOOK_BOT_TOKEN;
const webhookURL = process.env.WEBHOOK_URL;
const port = process.env.PORT || "4000";

interface JsonRequest<T> extends Request {
  body: T;
}

async function startBot() {
  if (!token) {
    throw new Error("Missing WEBHOOK_BOT_TOKEN.");
  }

  if (!webhookURL) {
    throw new Error("Missing WEBHOOK_URL.");
  }

  const webhookPath = `/webhook/${token}`;
  const fullWebhook = webhookURL + webhookPath;

  const app = express();
  app.use(bodyParser.json());

  const client = axios.create({
    baseURL: `https://api.telegram.org/bot${token}`,
    timeout: 5000,
  });

  await client.post("/setWebhook", { url: fullWebhook });

  app.post(webhookPath, async (req: JsonRequest<any>, res: Response) => {
    try {
      const update = req.body;

      if (!update) {
        res.status(400).send("Missing body");
        return;
      }

      if (!update.message.text) {
        res.send("{}");
        return;
      }

      const chatId = update.message.chat.id;

      console.info("🛫 Sending the message.");

      await client.post("/sendMessage", {
        chat_id: chatId,
        text: `${update.message.text.toUpperCase()} 🔥🔥🔥`,
      });

      res.send("{}");
    } catch (e: any) {
      console.error(`❌ Update processing failed.`, e.message);
      res.status(500).send("Something is wrong.");
    }
  });

  app.listen(port, () => {
    console.info(`🚀 Bot is online (REST API + Webhook)`);
  });
}

startBot();
