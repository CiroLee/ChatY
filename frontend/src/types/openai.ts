import { getBillSubscription } from '@/api';

export type Role = 'system' | 'user' | 'assistant';
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

export interface BillSubscriptionRes {
  access_until: number;
  account_name: string;
  hard_limit: number;
  hard_limit_usd: number;
}

export interface BillUsageRes {
  total_usage: number;
}
