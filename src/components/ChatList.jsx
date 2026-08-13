import { memo } from "react";

const ChatList = memo(function ChatList({
  chats,
  onStartNewChat,
  onChatSelected,
  selectedChatId,
}) {
  function getChatListClassName(isSelected) {
    return isSelected ? "chat-list-item selected" : "chat-list-item";
  }

  function getChatName(date) {
    return new Date(parseInt(date)).toLocaleString();
  }

  return (
    <div className="border-r border-gray-200 flex flex-col">
      <button
        className="cursor-pointer border-2 border-gray-200 p-4"
        onClick={onStartNewChat}
      >
        new chat
      </button>
      <ul className="p-1">
        {chats.length > 0 &&
          chats.map((chat) => {
            const chatLabel = chat.chatId ?? "Chat";
            const chatKey = chatLabel;

            return (
              <li
                className={getChatListClassName(chat.chatId === selectedChatId)}
                key={chatLabel}
                onClick={() => onChatSelected(chat.chatId)}
              >
                {getChatName(chat.chatId)}
              </li>
            );
          })}
      </ul>
    </div>
  );
});

export default ChatList;
