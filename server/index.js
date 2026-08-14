import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { constructMessage } from "../src/utils/messageUtils.js";

dotenv.config();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MESSAGES_DIR = path.join(__dirname, "./messages");
// const DB_PATH = path.join(__dirname, "message.json");

const readMessages = async (chatPath) =>
  JSON.parse(await fs.promises.readFile(chatPath, "utf-8"));

const writeMessages = async (chatPath, mesgs) =>
  await fs.promises.writeFile(chatPath, JSON.stringify(mesgs, null, 2));

const getChatPath = (chatId) =>
  path.join(MESSAGES_DIR, `messages_${chatId}.json`);

if (!fs.existsSync(MESSAGES_DIR)) {
  fs.mkdirSync(MESSAGES_DIR, { recursive: true });
}

app.post("/api/chats", async (req, res) => {
  const chatId = Date.now().toString(); // TODO: come up with better naming
  const initialMessage = [
    constructMessage(1, "them", "Hi there! Ask me anything!"),
  ];

  await writeMessages(getChatPath(chatId), initialMessage);

  res.json({ chatId });
});

// gets all the message files to build the chat list
app.get("/api/chats", (req, res) => {
  const files = fs
    .readdirSync(MESSAGES_DIR)
    .filter((f) => f.startsWith("messages_") && f.endsWith(".json"))
    .map((f) => ({
      chatId: f.replace("messages_", "").replace(".json", ""),
      createdAt: fs.statSync(path.join(MESSAGES_DIR, f)).birthtime,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(files);
});

// read the individual message file (chat content)
app.get("/api/messages/:chatId", async (req, res) => {
  try {
    const msgs = await readMessages(getChatPath(req.params.chatId));
    res.json(msgs);
  } catch (err) {
    res.status(404).json({ error: "Chat not found" });
  }
});

// either 'me' or 'them' said something
app.post("/api/messages/:chatId", async (req, res) => {
  const messages = await readMessages(getChatPath(req.params.chatId));
  const message = constructMessage(messages.length + 1, "me", req.body.text);
  messages.push(message);
  await writeMessages(getChatPath(req.params.chatId), messages);

  // history
  const history = messages.map((m) => ({
    role: m.from === "me" ? "user" : "assistant",
    content: m.text,
  }));

  let response;
  if (req.body.llm === "claude") {
    response = await getResponseFromClaude(history);
  } else {
    response = await getResponseFromOllama(history);
  }

  const data = await response.json();
  const replyText = data.message.content;
  const updated = await readMessages(getChatPath(req.params.chatId));
  const reply = constructMessage(updated.length + 1, "them", replyText);

  updated.push(reply);
  // app.listen(3001, () => console.log("response from the LLM: ", message, reply));
  await writeMessages(getChatPath(req.params.chatId), updated);
  res.json(reply);
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));

// helpers
async function getResponseFromClaude(history) {
  throw new Error(
    "Claude integration is not enabled for the time being. Please use Ollama instead",
  );
  // const response = await anthropic.messages.create({
  //   model: "claude-sonnet-4-5",
  //   max_tokens: 500,
  //   system:
  //     "You are a knowledgeable medical assistant. Answer clearly and concisely. Always recommend consulting a doctor for serious concerns.",
  //   messages: history,
  // });

  // return response;
}

async function getResponseFromOllama(history) {
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1",
      stream: false,
      messages: history,
    }),
  });

  return response;
}
