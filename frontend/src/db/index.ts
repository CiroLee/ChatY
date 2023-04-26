import Dexie, { Table } from 'dexie';
import type { ChatSession } from '@/types/db';

class chatSession extends Dexie {
  chats!: Table<Partial<ChatSession>>;
  constructor() {
    super('chatSession');
    this.version(1).stores({
      chats: '++id,sessionId,name,createAt',
    });
  }
  async create(data: Partial<ChatSession>) {
    return this.chats.add(data);
  }
  async queryAll() {
    return this.chats.toArray();
  }
  async update(id: number, data: Partial<Omit<ChatSession, 'id'>>) {
    if (id < 0) return;
    return this.chats.update(id, data);
  }
  async remove(id: number) {
    this.chats.delete(id);
  }
}

export const chatSessionDB = new chatSession();
