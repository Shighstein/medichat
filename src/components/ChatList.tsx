import { memo } from "react";
import ChatListItem from "./ChatListItem";
import { Chat } from "../types/chat";

const ChatList = memo(function ChatList({
  chats,
  onStartNewChat,
  onChatSelected,
  onArchiveChat,
  selectedChatId,
}: {
  chats: Chat[];
  onStartNewChat: () => void;
  onChatSelected: (chatid: string) => void;
  onArchiveChat: (chatId: string) => void;
  selectedChatId: string | null;
}) {
  function getChatListClassName(isSelected: boolean) {
    return isSelected ? "chat-list-item selected" : "chat-list-item";
  }

  return (
    <div className="chat-list h-full flex flex-col min-w-10 bg-white">
      <button
        className="new-button button cursor-pointer p-4 flex flex-row bg-linear-to-b from-indigo-100 to-indigo-50"
        onClick={onStartNewChat}
      >
        <span className="flex grow-1">New chat</span>
        <img src="src/images/plus-fill-purple.svg" height="20" width="20" />
      </button>
      <ul className="">
        {chats.length > 0 &&
          chats.map((chat) => {
            return (
              <li
                key={chat.chatId}
                onClick={() => onChatSelected(chat.chatId)}
                className={getChatListClassName(selectedChatId === chat.chatId)}
              >
                <ChatListItem
                  chatName={chat.name}
                  onArchive={() => onArchiveChat(chat.chatId)}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
});

export default ChatList;
