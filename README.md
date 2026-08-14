# medichat
A simple chatbot that you can ask medical question. 
## How to use it
Simply tell it the symptoms you are experiencing and let it ask you.  Eventually, you can ask which doctors to see.
### Note
This is just meant to be a simple personal project so it's not meant to be an actual medical advisor of any sort. As any other AI Agent, it can make mistakes, please don't take what it suggests seriously!

## Current state of the app
### Reloading bug
Currently, it has a bug where everytime the message is updated, it reloads the whole page and unselect the chat from the left hand side nav. Annoying, I know but I'm still working on it.
### LLM model choice
Right now, in order to reduce the cost, I'm only using Ollama which is served locally. Once it's working a bit better, I'll enabled the option to use the Claude API.
### Unit tests
None of those for now

## How to run it
* Run Ollama (you need to download first)
* `npm run dev` in one terminal to run the project
* `npm run server` in another terminal to run the server

This will launch the Vite development server, and you can open the local URL shown in the terminal in your browser. Usually, that is `localhost:5173`.

### Install dependencies if needed

If needed, install the project dependencies first:

```bash
npm install
```
