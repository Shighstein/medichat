import { memo } from "react";
import ChatListItem from "./ChatListItem";

const ChatList = memo(function ChatList({
  chats,
  onStartNewChat,
  onChatSelected,
  onArchiveChat,
  selectedChatId,
}) {
  function getChatListClassName(isSelected) {
    return isSelected ? "chat-list-item selected" : "chat-list-item";
  }

  function getChatName(date) {
    return new Date(parseInt(date)).toLocaleString();
  }

  return (
    <div className="chat-list h-full flex flex-col min-w-10 bg-white">
      <button
        className="new-button button cursor-pointer p-4 flex flex-row "
        onClick={onStartNewChat}
      >
        <span className="flex grow-1">New chat</span>
        <img src="src/images/plus-fill-purple.svg" height="20" width="20" />
      </button>
      <ul className="">
        {chats.length > 0 &&
          chats.map((chat) => {
            const chatLabel = chat.chatId ?? "Chat";
            const chatKey = chatLabel;

            return (
              <li
                key={chatLabel}
                onClick={() => onChatSelected(chat.chatId)}
                className={getChatListClassName(selectedChatId === chat.chatId)}
              >
                <ChatListItem
                  chatName={getChatName(chat.chatId)}
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
