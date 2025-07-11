// File: types.ts

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  fileUrl?: string;
  fileType?: 'image' | 'video';
  file?: File | Blob;
}
