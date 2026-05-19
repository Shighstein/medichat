import { useState, useEffect } from 'react';
import './MainPanel.css';


export default function MainPanel() {
  const [ contacts, setContacts ] = useState([]);
  const [ messages, setMessages ] = useState([]);
  const [ draft, setDraft ] = useState('');
  
  // useEffect(() => {
  //   fetch('http://localhost:3001/api/contacts')
  //   .then(res => res.json())
  //   .then(setContacts)
  // })

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:3001/api/messages')
        .then(r => r.json())
        .then(setMessages);
    }, 2000);

    return () => clearInterval(interval);
  }, [])
  
  const send = () => {
    const text = draft.trim();
    console.log(`send(). text: ${text}`)
    if (!text) return;

    fetch('http://localhost:3001/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({text})
    })
    .then(r => r.json())
    .then(newMessage => {
      setMessages(prev => [...prev, newMessage]);
      setDraft('');
    })
  }

  return (
    <div className="main-panel">
      <div className="thread-header">Lemme help you</div>
      <div className="converstaion-container">
        {messages.map((msg) => {
        const isMe = msg.from === 'me';
        return (
          <div key={msg.id}
            className={`message ${isMe ? 'from-me': 'from-them'}`}
          >
            <div>  
              {msg.text}
            </div>
          </div>
        )
        })}
      </div>
      <div className='input-bar'>
        <textarea id='message-input' className='input-message' type='text' placeholder={`message to them`} value={draft}
        onChange={(e) => setDraft(e.target.value)}
        />
        <button onClick={() => send()}>Send</button>
      </div>
    </div>
  );
}
