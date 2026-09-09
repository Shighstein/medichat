import { useState, useEffect, useContext, useCallback } from "react";
import { LLModelContext } from "../LLModelContext";
import ChatList from "./ChatList";
import Header from "./Header";
import { constructMessage } from "../utils/messageUtils.js";
import "./MainPanel.css";
import ChatContent from "./ChatContent";
import MessageInputBar from "./MessageInputBar";
import { Message, ROLES, Chat, ChatState } from "../types/types";
import {
  askLLM,
  fetchChatNames,
  getMessages,
  moveChatFild,
  startNewChat,
} from "./api/apicalls";
import { useResizableWidth } from "../utils/mouseEventUtils";

export default function MainPanel() {
  const [state, setState] = useState<ChatState>({
    chatList: [],
    selectedChatId: "",
    isThinking: false,
    draft: "",
    messages: [],
  });

  console.log("state:", state);

  const chats = state.chatList;
  const draft = state.draft;
  const isThinking = state.isThinking;
  const chatId = state.selectedChatId;
  const messages = state.messages;

  // const [messages, setMessages] = useState<Message[]>([]);
  const { llm } = useContext(LLModelContext);

  const { width: chatListWidth, handleResizeMouseDown } = useResizableWidth();

  const loadChatList = useCallback(() => {
    fetchChatNames().then((chats: Chat[]) => {
      setState((prev) => {
        return {
          ...prev,
          chatList: chats,
        };
      });
    });
  }, []);

  const createNewChat = useCallback(() => {
    startNewChat().then((data: { chatId: string }) => {
      setState((prev) => {
        return {
          ...prev,
          selectedChatId: data.chatId,
          messages: [],
        };
      });
    });
  }, []);

  const loadMessages = useCallback((id: string) => {
    getMessages(id)
      .then((res: Message[]) => {
        console.log("res: ", res);
        setState((prev) => {
          return {
            ...prev,
            messages: res,
          };
        });
      })
      .catch((reason) => console.error(`failed ${reason}`));
  }, []);

  const selectChat = useCallback(
    (id: string) => {
      setState((prev) => {
        return {
          ...prev,
          selectedChatId: id,
        };
      });
      loadMessages(id);
    },
    [loadMessages],
  );

  const archiveChat = useCallback(
    (id: string) => {
      console.log("archiving chat", id);
      moveChatFild(id).then(() => {
        if (chatId === id) {
          setState((prev) => {
            return {
              ...prev,
              selectedChatId: "",
            };
          });
        }
        loadChatList();
      });
    },
    [chatId, loadChatList],
  );

  const addUserMessage = useCallback((text: string, chatId: string) => {
    setState((prev: ChatState) => {
      return {
        ...prev,
        isThinking: true,
        messages: [
          ...prev.messages,
          constructMessage(messages.length + 1, ROLES.USER, text, chatId),
        ],
      };
    });
  }, []);

  const addAssistanceMessage = useCallback(
    (text: string, chatId: string) => {
      askLLM({ chatId, text, llm }).then(({ replyText, chatName }) => {
        console.log("chatName returned", chatName);

        setState((prev) => {
          return {
            ...prev,
            isThinking: false,
            messages: [...prev.messages, replyText],
            chatList: prev.chatList.map((c) =>
              c.chatId === chatId && chatName ? { ...c, name: chatName } : c,
            ),
          };
        });
      });
    },
    [llm],
  );

  const send = useCallback(
    (chatId: string) => {
      const text = draft.trim();
      if (!text) return;

      addUserMessage(text, chatId);
      addAssistanceMessage(text, chatId);

      setState((prev) => {
        return {
          ...prev,
          draft: "",
        };
      });
    },
    [draft, addUserMessage, addAssistanceMessage],
  );

  useEffect(() => {
    loadChatList();
  }, []);

  return (
    <div className="main-panel">
      <Header />
      <div className="main-container">
        <div style={{ width: chatListWidth, flexShrink: 0 }}>
          <ChatList
            chats={chats}
            selectedChatId={chatId}
            onStartNewChat={createNewChat}
            onChatSelected={selectChat}
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
            onChange={(e) =>
              setState((prev) => ({ ...prev, draft: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) {
                e.preventDefault();
                e.stopPropagation();
                send(state.selectedChatId);
              }
            }}
            onSend={() => send(state.selectedChatId)}
          />
        </div>
      </div>
    </div>
  );
}
