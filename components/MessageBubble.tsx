import React from 'react';

interface Props {
  role: string;
  content: string;
  imageUrl?: string;
}

const MessageBubble: React.FC<Props> = ({ role, content, imageUrl }) => {
  const isUser = role === 'user';

  return (
    <div className={`my-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs px-4 py-2 rounded-lg ${isUser ? 'bg-pink-300 text-white' : 'bg-gray-200 text-black'}`}>
        <p>{content}</p>
        {imageUrl && (
          <img src={imageUrl} alt="User upload" className="mt-2 max-w-[180px] rounded" />
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
