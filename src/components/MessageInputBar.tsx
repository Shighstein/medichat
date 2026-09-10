import { type ChangeEventHandler, type KeyboardEventHandler } from "react";

function MessageInputBar({
  draft,
  onChange,
  onKeyDown,
  onSend,
}: {
  draft: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  onSend: () => void;
}) {
  return (
    <div className="input-bar border-t-2 border-gray-200 flex items-stretch self-stretch pl-3 bg-white">
      <textarea
        id="message-input"
        className="input-message flex-1 p-2"
        placeholder={`Ask anything`}
        value={draft}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <button
        className="send-button button px-4 cursor-pointe bg-linear-to-br from-pink-500 to-purple-500 border-b-2 border-indigo-50"
        type="button"
        onClick={onSend}
      >
        <img
          src="src/images/send-outline-nofill-white.svg"
          alt="send"
          width="20"
          height="20"
        />
      </button>
    </div>
  );
}

export default MessageInputBar;
