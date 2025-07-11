// Updated api.ts with GPT-4 Vision support and clean message formatting

import { ChatMessage } from './types';

export const sendMessageToAI = async (
  messages: ChatMessage[],
  apiKey: string
): Promise<string> => {
  const latestMessage = messages[messages.length - 1];

  const formattedMessages = messages.map(({ role, content }) => ({
    role,
    content
  }));

  const hasImage = !!latestMessage.fileUrl;

  const payload: any = {
    model: hasImage ? 'gpt-4-vision-preview' : 'gpt-4',
    messages: hasImage ? formattedMessages.slice(0, -1) : formattedMessages,
  };

  if (hasImage && latestMessage.fileUrl) {
    payload.messages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: latestMessage.content || 'What do you think of this image?',
        },
        {
          type: 'image_url',
          image_url: {
            url: latestMessage.fileUrl,
          },
        },
      ],
    });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || 'Failed to fetch AI response');
    }

    return data.choices?.[0]?.message?.content || '';
  } catch (err) {
    console.error('OpenAI API error:', err);
    return 'Oops, something went wrong while trying to get Olivia’s response.';
  }
};
