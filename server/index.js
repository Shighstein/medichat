// import Anthropic from "@anthropic-ai/sdk";
// import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { constructMessage } from "../src/utils/messageUtils.js";
// import { Message } from '../src/Message';

// dotenv.config();
// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "message.json");

const readMessages = (chatPath) =>
  JSON.parse(fs.readFileSync(chatPath, "utf-8"));

const writemessages = (chatPath, mesgs) =>
  fs.writeFileSync(chatPath, JSON.stringify(mesgs, null, 2));

const app = express();
app.use(cors());
app.use(express.json());

const getChatPath = (chatId) => path.join(__dirname, `messages_${chatId}.json`);

app.post("/api/chats", async (req, res) => {
  const chatId = Date.now().toString(); // TODO: come up with better naming
  const initialMessage = [constructMessage(1, "them", "how can i help")];
  
  const chatPath = getChatPath(chatId);
  await fs.promises.writeFile(
    chatPath,
    JSON.stringify(initialMessage, null, 2),
  );
  res.json({ chatId });
});

app.get("/api/chats", (req, res) => {
  const files = fs
    .readdirSync(__dirname)
    .filter((f) => f.startsWith("messages_") && f.endsWith(".json"))
    .map((f) => ({
      chatId: f.replace("messages_", "").replace(".json", ""),
      createdAt: fs.statSync(path.join(__dirname, f)).birthtime,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(files);
});

app.get("/api/messages/:chatId", async (req, res) => {
  try {
    const msgs = JSON.parse(
      await fs.promises.readFile(getChatPath(req.params.chatId), "utf-8"),
    );
    res.json(msgs);
  } catch (err) {
    res.status(404).json({ error: "Chat not found" });
  }
});

app.post("/api/messages/:chatId", async (req, res) => {
  // app.listen(3001, () => console.log("--- posting a message", req));
  const messages = JSON.parse(
    fs.readFileSync(getChatPath(req.params.chatId), "utf-8"),
  );

  const message = {
    id: messages.length + 1,
    from: "me",
    text: req.body.text,
    ts: new Date().toLocaleDateString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  messages.push(message);
  writemessages(getChatPath(req.params.chatId), messages);

  // history
  const history = messages.map((m) => ({
    role: m.from === "me" ? "user" : "assistant",
    content: m.text,
  }));


  // using claude
  // const response = await anthropic.messages.create({
  //   model: "claude-sonnet-4-5",
  //   max_tokens: 500,
  //   system:
  //     "You are a knowledgeable medical assistant. Answer clearly and concisely. Always recommend consulting a doctor for serious concerns.",
  //   messages: history,
  // });

  // using llama
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1",
      stream: false,
      messages: history,
    }),
  });

  const data = await response.json();
  const replyText = data.message.content;

  // app.listen(3001, () => console.log("response from the AI: ", data));

  // or auto reply for now
  // const replyText = "Could you give me more info?";

  const updated = readMessages(getChatPath(req.params.chatId));

  const reply = {
    id: updated.length + 1,
    from: "them",
    text: replyText,
    ts: new Date().toLocaleDateString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  updated.push(reply);
  app.listen(3001, () => console.log("response from the AI: ", message, reply));
  writemessages(getChatPath(req.params.chatId), updated);
  res.json(reply);
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
