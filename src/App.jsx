import { createRoot } from "react-dom/client";
import Mainpanel from "./components/MainPanel";

const App = () => {
  return (
    <div>
      <Mainpanel />
    </div>
    
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);