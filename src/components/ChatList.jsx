export default function ChatList({chats, onStartNewChat, onChatSelected}) {
  return (
    <div>
      <div className="chat-list">
        <button onClick={onStartNewChat}>new chat</button>
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
                  className={chat.chatId === targetChatId ? "selected" : ""}
                  onClick={() => onChatSelected(targetChatId)}
                >
                  {chatLabel}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  )
}