// File: hooks/useChat.ts
import { useState } from 'react';
import { sendMessageToAI } from '../api';
import { systemPrompt } from '../utils/promptBuilder';

export const useChat = (apiKey: string) => {
  const [messages, setMessages] = useState<any[]>([{
    role: 'system',
    content: systemPrompt
  }]);

  const sendMessage = async (userInput: string) => {
    const newUserMsg = { role: 'user', content: userInput };
    const updatedMsgs = [...messages, newUserMsg];
    setMessages(updatedMsgs);
    const reply = await sendMessageToAI(updatedMsgs, apiKey);
    setMessages([...updatedMsgs, { role: 'assistant', content: reply }]);
  };

  return {
    messages: messages.filter(m => m.role !== 'system'),
    sendMessage,
    setInput: (input: string) => {},
  };
};

// This custom hook manages the chat state, including sending messages and updating the message list. 
// It initializes with a system prompt and provides a function to send user messages to the AI, updating the state with the AI's response.