import { createRoot } from "react-dom/client";
import MainPanel from "./components/MainPanel";
import { LLModelProvider } from "./LLModelContext";

const App = () => {
  return (
    <>
      <LLModelProvider>
        <MainPanel />
      </LLModelProvider>
    </>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);