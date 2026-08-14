function MessageInputBar({draft, onChange, onKeyDown, onSend}) {
  return (

    <div className="input-bar">
      <textarea
        id="message-input"
        className="input-message"
        type="text"
        placeholder={`Ask anything`}
        value={draft}
        onChange={onChange}
        onKeyDown={onKeyDown}
        />
      <button type="button" onClick={onSend}>
        Send
      </button>
    </div>
  );
}

export default MessageInputBar;