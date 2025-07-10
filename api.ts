// File: api.ts
import { ChatMessage } from './types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function sendMessageToOpenAI(
  messages: ChatMessage[],
  apiKey: string,
  file?: File
): Promise<string> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    // Convert image file to base64 if present
    let content: any = messages;

    // Determine model: vision if file, otherwise default to gpt-3.5
    const model = file ? 'gpt-4-vision-preview' : 'gpt-3.5-turbo';

    if (file) {
      if (!file.type.startsWith('image/')) {
        return "Olivia can only interpret images right now 📸. Try uploading a photo of your outfit!";
      }

      const base64 = await toBase64(file);
      const fileExtension = file.type.split('/')[1];

      content = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: messages[messages.length - 1].content,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/${fileExtension};base64,${base64}`,
              },
            },
          ],
        },
      ];
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: content,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? 'Sorry, Olivia didn’t get that! 😢';
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return 'Something went wrong talking to Olivia 🧠💔';
  }
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result.split(',')[1]); // remove data: prefix
      } else {
        reject('Failed to convert image to base64');
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
