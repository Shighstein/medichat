import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from "react";

type LLMContextValue = {
  llm: string;
  setLlm: Dispatch<SetStateAction<string>>;
};

export const LLModelContext = createContext<LLMContextValue>({
  llm: "ollama",
  setLlm: function () {},
});

export function LLModelProvider({ children }: PropsWithChildren) {
  const [llm, setLlm] = useState<string>("ollama");
  const value = useMemo(() => ({ llm, setLlm }), [llm]);
  return (
    <LLModelContext.Provider value={value}>{children}</LLModelContext.Provider>
  );
}
