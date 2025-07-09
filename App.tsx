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
    <div className="min-h-screen bg-pink-50 flex justify-center items-center p-4">
      {!apiKey ? <ApiKeyModal onSave={handleSaveKey} /> : <ChatWindow apiKey={apiKey} />}
    </div>
  );
};

export default App;