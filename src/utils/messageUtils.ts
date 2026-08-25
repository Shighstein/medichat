import { Message, ROLES } from "../types/message";

export function constructMessage(
  id: number,
  role: ROLES,
  text: string,
): Message {
  return {
    id,
    role,
    text,
    ts: new Date().toLocaleDateString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}
