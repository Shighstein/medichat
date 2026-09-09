import { Chat, Message } from "../../types/types";

export async function fetchChatNames(): Promise<Chat[]> {
  const res = await fetch("http://localhost:3001/api/chats");
  return (await res.json()) as Chat[];
}

export async function startNewChat(): Promise<{chatId: string}> {
  const res = await fetch("http://localhost:3001/api/chats", {
    method: "POST",
  });

  return (await res.json() as {chatId: string});
}

export async function moveChatFild(id: string): Promise<Response> {
  const res = fetch(`http://localhost:3001/api/chats/${id}`, {
    method: "DELETE",
  });

  return res;
}

export async function getMessages(chatId: string): Promise<Message[]> {
  const res = fetch(`http://localhost:3001/api/messages/${chatId}`);

  console.log('message', res);

  return res.then((response) => {
    if (response.ok) {
      return response.json() as Promise<Message[]>;
    }
    throw new Error(`Error fetching messages for chatId: ${chatId}. ${response.statusText}`);
  })
  .catch((error) => {
    throw new Error(`Error fetching messages for chatId: ${chatId}. ${error}`);
  });
}

export async function askLLM({
  chatId,
  text,
  llm
}: {
  chatId: string,
  text: string,
  llm: string
}): Promise<{replyText: Message, chatName: string}> {
  const res = fetch(`http://localhost:3001/api/messages/${chatId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, llm }),
  });

  return (await res).json();
}