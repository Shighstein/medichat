import { memo, useEffect, useRef } from "react";
import MessagePost from "./MessagePost";

function ChatContainer({ messages, isThinking }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    // <div className="chat-content-wrapper flex grow">
    <div className="chat-content">
      {messages.length > 0 &&
        messages.map((msg) => <MessagePost key={msg.id} msg={msg} />)}
      {isThinking && (
        <div key="thinking" className="thinking">
          Thinking...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
    // </div>
  );
}

export default ChatContainer;
