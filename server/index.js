import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

app.post("/api/messages", (req, res) => {
  console.log('body', req.body)
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

  // auto reply
  setTimeout(() => {
    app.listen(3001, () => console.log('set timeout'))
    const updated = readMessages();

    const reply = {
      id: updated.length + 1,
      from: "them",
      text: "Could you give me more info?",
      ts: new Date().toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    updated.push(reply);
    writemessages(updated);
    
  }, 1000)

});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
