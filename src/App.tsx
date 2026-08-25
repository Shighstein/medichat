import { createRoot } from "react-dom/client";
import MainPanel from "./components/MainPanel";
import { LLModelProvider } from "./LLModelContext";
import { ChatIdProvider } from "./ChatIdContext";

const App = () => {
  return (
    <>
      <LLModelProvider>
        <ChatIdProvider>
          <MainPanel />
        </ChatIdProvider>
      </LLModelProvider>
    </>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);