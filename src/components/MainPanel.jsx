import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { LLModelContext } from "../LLModelContext.jsx";
import ChatList from "./ChatList";
import Header from "./Header.jsx";
import { constructMessage } from "../utils/messageUtils.js";
import "./MainPanel.css";
import ChatContainer from "./ChatContainer.jsx";
import MessageInputBar from "./MessageInputBar.jsx";

export default function MainPanel() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [chatId, setChatId] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const { llm } = useContext(LLModelContext);

  const fetchChats = useCallback(() => {
    fetch("http://localhost:3001/api/chats")
      .then((r) => r.json())
      .then(setChats);
  }, []);

  const startNewChat = useCallback(() => {
    fetch("http://localhost:3001/api/chats", {
      method: "POST",
    })
      .then((r) => r.json())
      .then((data) => {
        setChatId(data.chatId);
        setMessages([]);
        fetchChats();
      });
  }, [fetchChats]);

  const chatSelected = useCallback((id) => {
    setChatId(id);
  }, []);

  const send = useCallback(() => {
    console.log("send()");
    const text = draft.trim();
    if (!text) return;

    addUserMessage(text);
    addAssistanceMessage(text);
    setDraft("");
  });

  const addUserMessage = useCallback((text) => {
    setMessages((prev) => [
      ...prev,
      constructMessage(prev.length + 1, "me", text),
    ]);

    setIsThinking(true);
  }, []);

  const addAssistanceMessage = useCallback(
    (text) => {
      fetch(`http://localhost:3001/api/messages/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, llm }),
      })
        .then((r) => r.json())
        .then((aiResponse) => {
          setMessages((prev) => [...prev, aiResponse]);
          setIsThinking(false);
        });
    },
    [chatId, llm],
  );

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (!chatId) return;

    fetch(`http://localhost:3001/api/messages/${chatId}`)
      .then((r) => r.json())
      .then(setMessages)
      .catch((reason) => console.error(`failed ${reason}`));
  }, [chatId]);

  // TODO: remove after re-rendering bug is resolved
  // useEffect(() => {
  //   console.log("--------------- chatId changed:", chatId);
  // }, [chatId]);

  return (
    <div className="main-panel">
      <Header />
      <div className="main-container">
        <ChatList
          chats={chats}
          selectedChatId={chatId}
          onStartNewChat={startNewChat}
          onChatSelected={chatSelected}
        />
        <div className="flex flex-1 flex-col grow basis-auto self-stretch">
          <ChatContainer messages={messages} isThinking={isThinking} />
          <MessageInputBar
            draft={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) {
                e.preventDefault();
                e.stopPropagation();
                send();
              }
            }}
            onSend={send}
          />
        </div>
      </div>
    </div>
  );
}
