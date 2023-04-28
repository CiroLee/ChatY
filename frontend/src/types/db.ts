import { Role } from './openai';

export interface ChatSession {
  id: number;
  chatId: string;
  name: string;
  avatarName?: string;
  createAt: number;
  description?: string;
  list: ChatItem[];
}

export interface ChatItem {
  id: string;
  role: Role;
  content: string;
  createAt: number;
}
