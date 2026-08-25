import {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { LLModelContext } from "../LLModelContext";
import { ChatIdContext } from "../ChatIdContext";
import ChatList from "./ChatList";
import Header from "./Header";
import { constructMessage } from "../utils/messageUtils.js";
import "./MainPanel.css";
import ChatContent from "./ChatContent";
import MessageInputBar from "./MessageInputBar";
import { Message, ROLES } from "../types/message";
import { Chat } from "../types/chat";

const CHAT_LIST_MIN_WIDTH = 150;
const CHAT_LIST_MAX_WIDTH = 600;

type ResizeStart = { startX: number; startWidth: number };

export default function MainPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatListWidth, setChatListWidth] = useState(200);
  const { chatId, setChatId } = useContext(ChatIdContext);
  const { llm } = useContext(LLModelContext);

  const resizeStartRef = useRef<ResizeStart | null>(null);

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeStartRef.current) return;
    const { startX, startWidth } = resizeStartRef.current;
    const nextWidth = startWidth + (e.clientX - startX);
    setChatListWidth(
      Math.min(CHAT_LIST_MAX_WIDTH, Math.max(CHAT_LIST_MIN_WIDTH, nextWidth)),
    );
  }, []);

  const handleResizeMouseUp = useCallback(() => {
    resizeStartRef.current = null;
    document.removeEventListener("mousemove", handleResizeMouseMove);
    document.removeEventListener("mouseup", handleResizeMouseUp);
  }, [handleResizeMouseMove]);

  const handleResizeMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      resizeStartRef.current = { startX: e.clientX, startWidth: chatListWidth };
      document.addEventListener("mousemove", handleResizeMouseMove);
      document.addEventListener("mouseup", handleResizeMouseUp);
    },
    [chatListWidth, handleResizeMouseMove, handleResizeMouseUp],
  );

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

  const chatSelected = useCallback((id: string) => {
    setChatId(id);
  }, []);

  const archiveChat = useCallback(
    (id: string) => {
      console.log("archiving chat", id);
      fetch(`http://localhost:3001/api/chats/${id}`, {
        method: "DELETE",
      }).then(() => {
        if (chatId === id) {
          setChatId(null);
          setMessages([]);
        }
        fetchChats();
      });
    },
    [chatId, fetchChats],
  );

  const addUserMessage = useCallback((text: string) => {
    setMessages((prev: Message[]) => [
      ...prev,
      constructMessage(prev.length + 1, ROLES.USER, text),
    ]);

    setIsThinking(true);
  }, []);

  const addAssistanceMessage = useCallback(
    (text: string) => {
      fetch(`http://localhost:3001/api/messages/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, llm }),
      })
        .then((r) => r.json())
        .then(({ replyText, chatName }) => {
          setMessages((prev) => [...prev, replyText]);
          setIsThinking(false);

          console.log("chatName returned", chatName);
          if (chatName) {
            setChats((chatList) =>
              chatList.map((c) =>
                c.chatId === chatId ? { ...c, name: chatName } : c,
              ),
            );
          }
        });
    },
    [chatId, llm],
  );

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text) return;

    addUserMessage(text);
    addAssistanceMessage(text);
    setDraft("");
  }, [draft, addUserMessage, addAssistanceMessage]);

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

  return (
    <div className="main-panel">
      <Header />
      <div className="main-container">
        <div style={{ width: chatListWidth, flexShrink: 0 }}>
          <ChatList
            chats={chats}
            selectedChatId={chatId}
            onStartNewChat={startNewChat}
            onChatSelected={chatSelected}
            onArchiveChat={archiveChat}
          />
        </div>
        <div
          onMouseDown={handleResizeMouseDown}
          className="resize-bar w-1 cursor-col-resize bg-indigo-100 hover:bg-purple-200 transition-colors"
        />
        <div className="chat-container flex flex-1 flex-col min-h-0 self-stretch">
          <ChatContent messages={messages} isThinking={isThinking} />
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
