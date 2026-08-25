import { memo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Message } from "../types/message";

marked.use({
  renderer: {
    link({ href, text }) {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    },
  },
});

function MessagePost({ msg }: { msg: Message }) {
  const isMe = msg.role === "user";
  return (
    <div className={`message ${isMe ? "from-me" : "from-them"}`}>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(marked(msg.text) as string),
        }}
        style={{ lineHeight: 1.5, fontSize: 14 }}
      />
    </div>
  );
}

export default memo(MessagePost);
