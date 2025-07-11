// Updated ChatWindow.tsx with proper File handling and Blob typing
import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import { sendMessageToAI } from '../api';
import { systemPrompt } from '../utils/promptBuilder';
import { ChatMessage } from '../types';
import { resizeImage } from '../utils/utils';

const ChatWindow: React.FC<{ apiKey: string }> = ({ apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'system', content: systemPrompt }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    let fileUrl: string | undefined = undefined;
    let processedFile: Blob | undefined = undefined;

    if (file) {
      try {
        processedFile = await resizeImage(file, 512); // Resize and assign typed Blob
        fileUrl = URL.createObjectURL(processedFile);
      } catch (error) {
        console.error('Image processing failed', error);
      }
    }

    const newMessage: ChatMessage = {
      role: 'user',
      content: input || (file ? 'What do you think of this?' : ''),
      fileUrl,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setFile(null);
    setIsTyping(true);

    const reply = await sendMessageToAI(updatedMessages, apiKey, processedFile);
    setMessages([...updatedMessages, { role: 'assistant', content: reply }]);
    setIsTyping(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl h-[80vh] flex flex-col relative">
      <h1 className="absolute top-4 text-4xl font-serif text-pink-600 font-bold tracking-wide drop-shadow-lg left-4">Olivia</h1>
      <div className="p-4 mt-12 overflow-y-auto flex-1">
        {messages.filter(msg => msg.role !== 'system').map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} fileUrl={msg.fileUrl} />
        ))}
        {isTyping && <div className="text-sm text-gray-400 italic">Olivia is typing...</div>}
      </div>
      <div className="p-4 border-t flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-4 py-2"
          placeholder="Ask Olivia something stylish..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          type="file"
          accept="image/*,video/*"
          className="border rounded px-2 py-1"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
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
