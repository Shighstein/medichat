export interface Message {
  id: number;
  role: ROLES;
  text: string;
  ts: string;
}

export enum ROLES  {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system"
};