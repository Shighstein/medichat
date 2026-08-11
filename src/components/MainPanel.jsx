import { useState, useEffect } from 'react';
import { marked } from "marked";
import DOMPurify from "dompurify";
import './MainPanel.css';

export default function MainPanel() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [chatId, setChatId] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  const fetchChats = () => {
    fetch("http://localhost:3001/api/chats")
      .then((r) => r.json())
      .then(setChats);
  };

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

  const startNewChat = () => {
    fetch("http://localhost:3001/api/chats", {
      method: "POST",
    })
      .then((r) => r.json())
      .then((data) => {
        setChatId(data.chatId);
        setMessages([]);
        fetchChats();
      });
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((prev) => [
      ...prev,
      {
        id: messages.length + 1,
        from: "me",
        text,
        ts: new Date().toLocaleDateString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setIsThinking(true);

    fetch(`http://localhost:3001/api/messages/${chatId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
      .then((r) => r.json())
      .then((aiResponse) => {
        console.log("newMessage:", aiResponse);
        setMessages((prev) => [...prev, aiResponse]);
        setIsThinking(false);
      });
  };

  return (
    <div className="main-panel">
      <div className="chat-list">
        <button onClick={startNewChat}>new chat</button>
        <ul>
          {chats.length > 0 &&
            chats.map((chat) => {
              const chatLabel =
                typeof chat === "string"
                  ? chat
                  : (chat.chatId ?? chat.id ?? "Chat");
              const chatKey = chatLabel;
              const targetChatId = chat.chatId ?? chat.id;

              return (
                <li
                  key={chatKey}
                  className={chatId === targetChatId ? "selected" : ""}
                  onClick={() => {
                    setChatId(targetChatId);
                  }}
                >
                  {chatLabel}
                </li>
              );
            })}
        </ul>
      </div>
      <div className="main-container">
        <div className="thread-header">
          <h2>Med chat</h2>
        </div>
        <div className="current-chat">
          <div className="chat-content">
            {messages.length > 0 &&
              messages.map((msg) => {
                const isMe = msg.from === "me";
                return (
                  <div
                    key={msg.id}
                    className={`message ${isMe ? "from-me" : "from-them"}`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(marked(msg.text)),
                      }}
                      style={{ lineHeight: 1.5, fontSize: 14 }}
                    />
                  </div>
                );
              })}
            {isThinking && (
              <div key="thinking" className="thinking">
                Thinking...
              </div>
            )}
          </div>
          <div>
            <form
              className="input-bar"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <textarea
                id="message-input"
                className="input-message"
                type="text"
                placeholder={`Ask anything`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
