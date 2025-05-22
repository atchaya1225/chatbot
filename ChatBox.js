import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBox.css';

const ChatBox = () => {
  const [input, setInput] = useState('');
  const [chats, setChats] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    axios.get('/api/chat/history')
      .then(res => setChats(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { message: input, response: '' };
    setChats(prev => [...prev, userMessage]);
    setInput('');
    setIsBotTyping(true);

    try {
      const res = await axios.post('/api/chat', { message: input });
      setChats(prev =>
        prev.map((chat, i) =>
          i === prev.length - 1 ? { ...chat, response: res.data.response } : chat
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const clearChat = () => {
    setChats([]);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>🤖 Smart Chatbot</h2>
        <button onClick={clearChat} className="clear-history-btn">🧹 Clear</button>
      </div>

      <div className="chat-window">
        {chats.length === 0 && <p className="chat-empty">Start the conversation!</p>}
        {chats.map((chat, idx) => (
          <div key={idx} className="chat-message-pair">
            <div className="chat-bubble user-bubble">
              <div className="avatar user-avatar">🧑</div>
              <div className="bubble-text">{chat.message}</div>
            </div>
            <div className="chat-bubble bot-bubble">
              <div className="avatar bot-avatar">🤖</div>
              <div className="bubble-text">
                {chat.response ? chat.response : <span className="typing-dots">Typing<span>.</span><span>.</span><span>.</span></span>}
              </div>
            </div>
          </div>
        ))}
        {isBotTyping && (
          <div className="chat-bubble bot-bubble">
            <div className="avatar bot-avatar">🤖</div>
            <div className="bubble-text typing-dots">Typing<span>.</span><span>.</span><span>.</span></div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chat-input"
        />
        {input && (
          <button className="clear-btn" onClick={() => setInput('')} title="Clear">&times;</button>
        )}
        <button className="send-btn" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
