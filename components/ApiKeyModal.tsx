// File: components/ApiKeyModal.tsx
import React, { useState } from 'react';

interface Props {
  onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<Props> = ({ onSave }) => {
  const [input, setInput] = useState('');

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-md">
      <h2 className="text-lg font-bold mb-4">Enter Your OpenAI API Key</h2>
      <input
        type="password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
      />
      <button
        className="bg-pink-500 text-white px-4 py-2 rounded"
        onClick={() => onSave(input)}
      >
        Save Key
      </button>
    </div>
  );
};

export default ApiKeyModal;