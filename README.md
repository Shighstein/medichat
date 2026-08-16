# medichat
A simple chatbot that you can ask medical question. 

## How to use it
Simply tell it the symptoms you are experiencing and let it ask you.  Eventually, you can ask which doctors to see.
### Note
This is just meant to be a simple personal project so it's not meant to be an actual medical advisor of any sort. As any other AI Agent, it can make mistakes, please don't take what it suggests seriously!

## Known issues
* LLM switcher (cloud Claude API/Ollama local) - the switch on UI exists but Claude option is disabled temporarily

## Testing
None of those for now

## How to run it
### Download Ollama if not already
1. Install and launch from ollama.com
2. run `ollama run llama3.1` to download and start the model
### Node 
* `npm install` to install the dependencies
* `npm run dev` in one terminal to run the project
* `npm run server` in another terminal to run the server

This will launch the Vite development server, and you can open the local URL shown in the terminal in your browser. Usually, that is `localhost:5173`.

