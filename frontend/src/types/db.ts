import { Role } from './openai';

export interface ChatSession {
  id: number;
  chatId: string;
  name: string;
  avatarName?: string;
  createAt: number;
  updateAt?: number;
  ispinned?: boolean;
  description?: string;
  list: ChatItem[];
  temperature?: number;
  maxToken?: number;
  continuousChat?: boolean;
}

export interface ChatItem {
  id: string;
  role: Role;
  content: string;
  createAt: number;
}
