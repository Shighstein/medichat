import { Message, ROLES } from "../types/message";

export function constructMessage(
  id: number,
  role: ROLES,
  text: string,
  chatId: string,
): Message {
  return {
    id,
    role,
    text,
    chatId,
    ts: new Date().toLocaleDateString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}
