import { Chat, Message } from "../../types/types";

export async function fetchChatNames(): Promise<Chat[]> {
  const res = await fetch("http://localhost:3001/api/chats");
  const data = await res.json() as Chat[];
  return data;
}

export async function startNewChat(): Promise<{chatId: string}> {
  const res = await fetch("http://localhost:3001/api/chats", {
    method: "POST",
  });

  const data = await res.json() as {chatId: string};
  return data;
}

export async function moveChatFile(id: string): Promise<{ok: boolean; message: string}> {
  const res= await fetch(
    `http://localhost:3001/api/chats/${id}`,
    {
      method: "DELETE",
    },
  )

  const data = (await res).json() as Promise<{ok: boolean, message: string}>;

  if (!(await data).ok) {
    throw new Error(`Error archiving chat with id: ${id}. ${res}`);
  }

  return data;
}

export async function getMessages(chatId: string, signal?: AbortSignal): Promise<Message[]> {
  const res = fetch(`http://localhost:3001/api/messages/${chatId}`, {
    signal
  });

  const response = await res;

  if (!response.ok) {
    throw new Error(
      `Error fetching messages for chatId: ${chatId}. ${response.statusText}`,
    );
  }
  return response.json() as Promise<Message[]>;
}

export async function askLLM({
  chatId,
  text,
  llm,
}: {
  chatId: string;
  text: string;
  llm: string;
}): Promise<{ replyText: Message; chatName: string | null }> {
  const res = fetch(`http://localhost:3001/api/messages/${chatId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, llm }),
  });

  return (await res).json();
}