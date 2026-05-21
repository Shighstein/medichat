// import Anthropic from "@anthropic-ai/sdk";
// import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// dotenv.config();

// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "message.json");

const readMessages = () => JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
const writemessages = (mesgs) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(mesgs, null, 2));

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/messages", (req, res) => {
  res.json(readMessages());
});

app.post("/api/messages", async (req, res) => {
  const messages = readMessages();
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
  writemessages(messages);
  res.json(message);

  // history
  const history = messages.map((m) => ({
    role: m.from === "me" ? "user" : "assistant",
    content: m.text,
  }));

  // const response = await anthropic.messages.create({
  //   model: "claude-sonnet-4-5",
  //   max_tokens: 500,
  //   system:
  //     "You are a knowledgeable medical assistant. Answer clearly and concisely. Always recommend consulting a doctor for serious concerns.",
  //   messages: history,
  // });

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

  const updated = readMessages();
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
  writemessages(updated);

  // auto reply
  setTimeout(() => {
    app.listen(3001, () => console.log("set timeout"));
    const updated = readMessages();

    const reply = {
      id: updated.length + 1,
      from: "them",
      text: "Could you give me more info?",
      ts: new Date().toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    updated.push(reply);
    writemessages(updated);
  }, 1000);
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
