import { ChatItem, ChatSession } from '@/types/db';
import { create } from 'zustand';

interface ChatStore {
  chatStatus: 'idle' | 'fetching' | 'outputting' | 'done';
  session: ChatSession; // 当前会话信息, 从chatList里得到
  chatList: ChatSession[]; // 所有会话列表 用于初始化sidebar和当前会话内容面板
  abortController?: AbortController;
  changeChatStatus: (status: 'idle' | 'fetching' | 'outputting' | 'done') => void;
  addQuestion: (item: ChatItem) => void;
  updateAnswerStream: (item: ChatItem) => void;
  setSession: (session: ChatSession) => void;
  setChatList: (list: ChatSession[]) => void;
  setAbortController: (abortController: AbortController) => void;
}

export const useChatSessionStore = create<ChatStore>((set) => ({
  chatStatus: 'idle',
  session: {
    id: 0,
    chatId: '',
    name: '',
    avatarName: '',
    createAt: 0,
    description: '',
    list: [],
    abortController: undefined,
  },
  chatList: [],

  setSession: (session: ChatSession) =>
    set(() => {
      if (Array.isArray(session.list)) {
        return { session };
      }
      return { ...session, list: [] };
    }),
  changeChatStatus: (status: 'idle' | 'fetching' | 'outputting' | 'done') => set(() => ({ chatStatus: status })),
  setChatList: (list: ChatSession[]) => set(() => ({ chatList: list })),
  setAbortController: (abortController: AbortController) => set(() => ({ abortController })),
  addQuestion: (item: ChatItem) =>
    set((state) => ({ session: { ...state.session, list: [...state.session.list, item] } })),
  updateAnswerStream: (item: ChatItem) =>
    set((state) => {
      const index = state.session.list.findIndex((i) => i.id === item.id);
      if (index === -1) {
        return {
          session: {
            ...state.session,
            list: [...state.session.list, item],
          },
        };
      } else {
        // update content
        state.session.list[index].content += item.content;
        return {
          session: {
            ...state.session,
            list: state.session.list,
          },
        };
      }
    }),
}));
