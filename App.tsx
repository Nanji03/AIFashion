// File: App.tsx
import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import ApiKeyModal from './components/ApiKeyModal';

const App = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('olivia_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSaveKey = (key: string) => {
    localStorage.setItem('olivia_api_key', key);
    setApiKey(key);
  };

  return (
    <div className="bg-pink-50 min-h-screen w-full flex justify-center items-center p-6">
      
    <h1 className="absolute top-6 text-4xl font-serif text-pink-600 font-bold tracking-wider drop-shadow-md z-10">
      Olivia
    </h1>
    {!apiKey ? <ApiKeyModal onSave={handleSaveKey} /> : <ChatWindow apiKey={apiKey} />}
  </div>
);
};

export default App;