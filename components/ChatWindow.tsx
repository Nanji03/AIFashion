import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import { sendMessageToOpenAI } from '../api';
import { systemPrompt } from '../utils/promptBuilder';

interface Props {
  apiKey: string;
}

const ChatWindow: React.FC<Props> = ({ apiKey }) => {
  const [messages, setMessages] = useState<any[]>([
    { role: 'system', content: systemPrompt }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    const userContent = input.trim() || (file ? `Uploaded file: ${file.name}` : '');

    const newUserMsg = { role: 'user', content: userContent };
    const updatedMsgs = [...messages, newUserMsg];
    setMessages(updatedMsgs);
    setInput('');
    setFile(null);
    setIsTyping(true);

    const reply = await sendMessageToOpenAI(updatedMsgs, apiKey, file ?? undefined);
    setMessages([...updatedMsgs, { role: 'assistant', content: reply }]);
    setIsTyping(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl h-[80vh] flex flex-col relative">
      {/* Vogue-style header */}
      {/* <h1 className="absolute top-4 left-4 text-4xl font-serif text-pink-600 font-bold tracking-wide drop-shadow-lg">
        Olivia
      </h1> */}

      {/* Messages */}
      <div className="p-4 pt-16 overflow-y-auto flex-1">
        {messages.filter(m => m.role !== 'system').map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {isTyping && (
          <div className="text-sm text-gray-400 italic mt-2">Olivia is typing...</div>
        )}
      </div>

      {/* Input section */}
      <div className="p-4 border-t border-pink-200 bg-white flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-pink-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-pink-400 transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Olivia something stylish..."
          />
          <input
            type="file"
            accept="image/*,video/*"
            className="block w-32 text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
        {file && (
          <div className="text-xs text-gray-600">
            Attached: {file.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
