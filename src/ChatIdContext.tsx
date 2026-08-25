import { createContext, useState } from "react";

export const ChatIdContext = createContext({
  chatId: null,
  setChatId: function(){}
});

export function ChatIdProvider({children}) {
  const [chatId, setChatId] = useState(null);

  return (
    <ChatIdContext.Provider value={{chatId, setChatId}}>
      {children}
    </ChatIdContext.Provider>
  )

};