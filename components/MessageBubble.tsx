// File: components/MessageBubble.tsx
import React from 'react';

interface Props {
  role: string;
  content: string;
}

const MessageBubble: React.FC<Props> = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="text-2xl">👩‍💼</div>
      )}
      <div
        className={`px-4 py-3 max-w-[75%] rounded-2xl shadow-sm whitespace-pre-wrap ${
          isUser
            ? 'bg-pink-400 text-white rounded-br-none'
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {content}
      </div>
      {isUser && (
        <div className="text-2xl">🙂</div>
      )}
    </div>
  );
};

// This component renders a message bubble with different styles for user and assistant messages.

export default MessageBubble;