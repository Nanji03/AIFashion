// File: ChatWindow.tsx
import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import { sendMessageToAI } from '../api';
import { systemPrompt } from '../utils/promptBuilder';
import { ChatMessage } from '../types';

interface Props {
  apiKey: string;
}

const ChatWindow: React.FC<Props> = ({ apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    const fileUrl = file ? URL.createObjectURL(file) : undefined;

    const newMessage: ChatMessage = {
      role: 'user',
      content: input || (file ? 'What do you think of this?' : ''),
      fileUrl,
};

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    const response = await sendMessageToAI(updatedMessages, apiKey, file || undefined);
    setMessages([...updatedMessages, { role: 'assistant', content: response }]);
    setFile(null);
    setIsTyping(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl h-[80vh] flex flex-col relative">
      <h1 className="absolute top-4 left-4 text-4xl font-serif text-pink-600 font-bold tracking-wide drop-shadow-lg">Olivia</h1>

      <div className="p-4 overflow-y-auto flex-1 mt-12 space-y-3">
  {messages.map((msg, i) => (
    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-pink-300 text-white' : 'bg-gray-200 text-black'}`}>
        <p>{msg.content}</p>

        {msg.fileUrl && (
          <>
            {msg.fileUrl.endsWith('.mp4') ? (
              <video controls className="mt-2 rounded max-w-[200px]">
                <source src={msg.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={msg.fileUrl}
                alt="Uploaded media"
                className="mt-2 rounded max-w-[200px]"
              />
            )}
          </>
        )}
      </div>
    </div>
  ))}

  {isTyping && (
    <div className="text-sm text-gray-400 italic mt-2">Olivia is typing...</div>
  )}
</div>


      <div className="p-4 border-t flex items-center gap-2">
        <input
          type="text"
          value={input}
          placeholder="Ask Olivia something stylish..."
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-4 py-2"
        />
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        <button
          className="bg-pink-500 text-white px-4 py-2 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
