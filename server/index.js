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
const ARCHIVE_DIR = path.join(__dirname, "./archive");

// const DB_PATH = path.join(__dirname, "message.json");

const readMessages = async (chatPath) =>
  JSON.parse(await fs.promises.readFile(chatPath, "utf-8"));

const writeMessages = async (chatPath, mesgs) =>
  await fs.promises.writeFile(chatPath, JSON.stringify(mesgs, null, 2));

const getChatPath = (chatId) =>
  path.join(MESSAGES_DIR, `messages_${chatId}.json`);

const chatIndex = async () => {
  const file = path.join(__dirname, `chat-index.json`);
  return JSON.parse(await fs.promises.readFile(file, "utf-8"));
};

const writeChatIndex = async (index) => {
  const file = path.join(__dirname, `chat-index.json`);
  await fs.promises.writeFile(file, JSON.stringify(index, null, 2));
};

if (!fs.existsSync(MESSAGES_DIR)) {
  fs.mkdirSync(MESSAGES_DIR, { recursive: true });
}

if (!fs.existsSync(ARCHIVE_DIR)) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

app.post("/api/chats", async (req, res) => {
  const chatId = Date.now().toString(); // TODO: come up with better naming
  const initialMessage = [
    constructMessage(1, "them", "Hi there! Ask me anything!"),
  ];

  await writeMessages(getChatPath(chatId), initialMessage);

  res.json({ chatId });
});


async function parseChatNames() {
  const chatNameIndex = await chatIndex();

  const files = fs
    .readdirSync(MESSAGES_DIR)
    .filter((f) => f.startsWith("messages_") && f.endsWith(".json"))
    .map((f) => ({
      chatId: f.replace("messages_", "").replace(".json", ""),
      createdAt: fs.statSync(path.join(MESSAGES_DIR, f)).birthtime,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return files.map((f) => ({
    chatId: f.chatId,
    createdAt: f.createdAt,
    name: chatNameIndex[f.chatId],
  }));
}

// gets all the message files to build the chat list
app.get("/api/chats", async (req, res) => {
  const files = await parseChatNames();
  res.json(files);
});

// archive a chat by moving its message file out of MESSAGES_DIR
app.delete("/api/chats/:chatId", async (req, res) => {
  const source = getChatPath(req.params.chatId);
  const destination = path.join(ARCHIVE_DIR, path.basename(source));

  try {
    await fs.promises.rename(source, destination);
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ error: "Chat not found" });
  }
});

// read the individual message file (chat content)
app.get("/api/messages/:chatId", async (req, res) => {
  try {
    const messages = await readMessages(getChatPath(req.params.chatId));
    res.json(messages);
  } catch (err) {
    res.status(404).json({ error: "Chat not found" });
  }
});

// either 'me' or 'them' said something
app.post("/api/messages/:chatId", async (req, res) => {
  const chatPath = getChatPath(req.params.chatId);
  const messages = await readMessages(chatPath);
  const message = constructMessage(messages.length + 1, "me", req.body.text);
  messages.push(message);
  await writeMessages(chatPath, messages);

  // history
  const history = messages.map((m) => ({
    role: m.from === "me" ? "user" : "assistant",
    content: m.text,
  }));

  let response;
  let chatName;
  if (req.body.llm === "claude") {
    response = await getResponseFromClaude(history);
  } else {
    // response = await getResponseFromOllama(history);

    [response, chatName] = await Promise.all([
      getResponseFromOllama(history),
      (await shouldRenameChat(req.params.chatId, history))
        ? updateChatName(history)
        : Promise.resolve(null),
    ]);
  }

  const data = await response.json();
  const replyText = data.message.content;
  const updated = await readMessages(chatPath);
  const reply = constructMessage(updated.length + 1, "them", replyText);

  updated.push(reply);
  await writeMessages(chatPath, updated);

  if (chatName) {
    const index = await chatIndex();
    index[req.params.chatId] = chatName;
    await writeChatIndex(index);
  }
  res.json({ reply, chatName });
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));

// helpers

async function shouldRenameChat(chatId, history) {
  const chatNameIndex = await chatIndex();
  return history.length > 3 && !chatNameIndex[chatId];
}

async function updateChatName(history) {
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1",
      stream: false,
      messages: [
        ...history,
        {
          role: "user",
          content:
            "Summarize the topic of this conversation in 3 to 5 words. Reply with only the summary - no punctuation. no quotes, no preamble.",
        },
      ],
    }),
  });

  const data = await response.json();
  return data.message.content.trim();
}


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
