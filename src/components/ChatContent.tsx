import { useEffect, useRef } from "react";
import MessagePost from "./MessagePost";
import { Message } from "../types/message";

function ChatContent({
  messages,
  isThinking,
}: {
  messages: Message[];
  isThinking: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    // <div className="chat-content-wrapper flex grow">
    <div className="chat-content p-2">
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

export default ChatContent;
