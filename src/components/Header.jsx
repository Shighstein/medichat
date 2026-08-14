import { memo, useContext } from 'react';
import { LLModelContext } from '../LLModelContext';

const Header = memo(function Header() {
  const {llm, setLlm} = useContext(LLModelContext);

  return (
    <div className="pb-2">
      <h2 className="font-medium text-5xl">Medi chat</h2>
      <p className="mb-3">
        Ask questions and have better questions to ask doctors
      </p>
      <label>
        <input
          type="checkbox"
          id="llm-mode"
          disabled
          checked
          onChange={(e) => setLlm(e.target.checked ? "ollama" : "claude")}
        />
        <span className="ml-2">
          Use Ollama
          <span className="text-xs ml-2">
            (currently only use Ollama because it's free!)
          </span>
        </span>
      </label>
    </div>
  );
});

export default Header;