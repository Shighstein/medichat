import { marked } from "marked";
import DOMPurify from "dompurify";

function MessagePost({msg}) {
  const isMe = msg.from === "me";
  return (
    <div
      className={`message ${isMe ? "from-me" : "from-them"}`}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(marked(msg.text)),
        }}
        style={{ lineHeight: 1.5, fontSize: 14 }}
      />
    </div>
  );
}

export default MessagePost;