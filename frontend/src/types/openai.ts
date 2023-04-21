export enum Role {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}
export interface ChatMessage {
  role: Role;
  content: string;
}

// completion接口返回包装后的数据
export interface ChatCompletionCbData {
  id: string;
  created: number;
  content: string;
}
