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

  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
  if (!input.trim()) return;

  const newUserMsg = { role: 'user', content: input };
  const updatedMsgs = [...messages, newUserMsg];
  setMessages(updatedMsgs);
  setInput('');
  setIsTyping(true);

  const reply = await sendMessageToAI(updatedMsgs, apiKey);
  setMessages([...updatedMsgs, { role: 'assistant', content: reply }]);
  setIsTyping(false);
};


return (
  <div className="bg-white shadow-xl rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col border border-pink-200 overflow-hidden">
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-pink-50">
  {messages.filter(m => m.role !== 'system').map((msg, i) => (
    <MessageBubble key={i} role={msg.role} content={msg.content} />
  ))}

  {isTyping && (
    <div className="text-sm text-gray-400 italic px-2 animate-pulse">
      Olivia is typing...
    </div>
  )}
</div>
    <div className="p-4 border-t border-pink-200 flex bg-white">
      <input
        className="flex-1 border border-pink-300 rounded-l-full px-4 py-2 focus:ring-2 focus:ring-pink-400 transition"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask Olivia something stylish..."
      />
      <button
        className="bg-pink-500 text-white px-6 py-2 rounded-r-full hover:bg-pink-600 transition"
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
