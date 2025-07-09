// File: components/ChatWindow.tsx
import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import { sendMessageToAI } from '../api';
import { systemPrompt } from '../utils/promptBuilder';

interface Props {
  apiKey: string;
}

const ChatWindow: React.FC<Props> = ({ apiKey }) => {
  const [messages, setMessages] = useState<any[]>([{
    role: 'system',
    content: systemPrompt
  }]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const newUserMsg = { role: 'user', content: input };
    const updatedMsgs = [...messages, newUserMsg];
    setMessages(updatedMsgs);
    setInput('');
    const reply = await sendMessageToAI(updatedMsgs, apiKey);
    setMessages([...updatedMsgs, { role: 'assistant', content: reply }]);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl h-[80vh] flex flex-col">
      <div className="p-4 overflow-y-auto flex-1">
        {messages.filter(m => m.role !== 'system').map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
      </div>
      <div className="p-4 border-t flex">
        <input
          className="flex-1 border rounded-l px-4 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Olivia something stylish..."
        />
        <button
          className="bg-pink-500 text-white px-4 py-2 rounded-r"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
// This component handles the chat window, displaying messages and allowing user input.`
