import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  sender: string;
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:5000/api/message", {
        message: input
      });

      const assistantMessage = { sender: "Assistant", text: response.data.reply };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "Assistant", text: "Error occurred." }]);
    }

    setInput("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "Arial" }}>
      <h2>XSanitaz Virtual Assistant</h2>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "scroll", marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <p key={idx}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        style={{ width: "80%", padding: 8 }}
      />
      <button onClick={sendMessage} style={{ padding: 8, marginLeft: 10 }}>Send</button>
    </div>
  );
};
export default Chat;

