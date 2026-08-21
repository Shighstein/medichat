import { memo, useContext } from 'react';
import { ChatIdContext } from '../ChatIdContext';

const ChatListItem = memo(function ChatListItem({chatName, onArchive}) {
  const { chatId, setChatId } = useContext(ChatIdContext);

  function deleteClicked() {
    if (window.confirm(`Are you sure you want to delete "${chatName}"?`)) {
      onArchive();
    }
  }

  return (
    <div className="flex items-center px-2.5 py-2">
      <span className="truncate flex-1">{chatName}</span>
      <button
        className="ml-3 shrink-0 cursor-pointer hover:bg-indigo-300 rounded-xl transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          deleteClicked();
        }}
      >
        <img src="src/images/cross-purple.svg" height="30" width="30" />
      </button>
    </div>
  );

});

export default ChatListItem;