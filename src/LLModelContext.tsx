import { createContext, useMemo, useState } from "react";

export const LLModelContext = createContext({
  llm: "ollama",
});

export function LLModelProvider({ children }) {
  const [llm, setLlm] = useState("ollama");
  const value = useMemo(() => ({ llm, setLlm }), [llm]);
  return (
    <LLModelContext.Provider value={value}>{children}</LLModelContext.Provider>
  );
}
