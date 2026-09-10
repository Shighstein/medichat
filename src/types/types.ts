
export enum ROLES  {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system"
};

// types

export type Message = {
  id: number;
  role: ROLES;
  text: string;
  ts: string;
  chatId: string;
}

export type Chat = {
  chatId: string;
  createdAt: Date;
  name: string | null;
};

export type ChatState = {
  chatList: Chat[];
  selectedChatId: string;
  isThinking: boolean;
  draft: string;
  messages: Message[];
};
