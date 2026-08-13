import { createContext, useState } from 'react';

export const LLModelContext = createContext({
  llm: 'ollama'}
)

export function LLModelProvider({children}) {
  const [llm, setLlm] = useState('ollama')
  return (
    <LLModelContext.Provider value={{llm, setLlm}}>
      {children}
    </LLModelContext.Provider>
  )
}