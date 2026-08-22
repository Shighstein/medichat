import { memo } from "react";

function MessageInputBar({ draft, onChange, onKeyDown, onSend }) {
  return (
    <div className="input-bar border-t-2 border-gray-200 flex items-stretch self-stretch pl-3 bg-white">
      <textarea
        id="message-input"
        className="input-message flex-1 p-2"
        type="text"
        placeholder={`Ask anything`}
        value={draft}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <button
        className="send-button button px-4 cursor-pointe bg-linear-to-b from-pink-100 to-pink-0 border-b-2 border-indigo-50"
        type="button"
        onClick={onSend}
      >
        <img
          src="src/images/send-outline-nofill-purple.svg"
          atl="send"
          width="20"
          height="20"
        />
      </button>
    </div>
  );
}

export default memo(MessageInputBar);
