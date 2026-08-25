import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";

type ChatIdContextValue = {
  chatId: string | null;
  setChatId: Dispatch<SetStateAction<string | null>>;
};

export const ChatIdContext = createContext<ChatIdContextValue>({
  chatId: null,
  setChatId: function () {},
});

export function ChatIdProvider({ children }: PropsWithChildren) {
  const [chatId, setChatId] = useState<string | null>(null);

  return (
    <ChatIdContext.Provider value={{ chatId, setChatId }}>
      {children}
    </ChatIdContext.Provider>
  );
}
