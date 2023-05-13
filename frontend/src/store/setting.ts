import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export interface SettingStore {
  currentSessionId: string;
  apiKey: string;
  temperature: number;
  maxReplayLength: number;
  continuousChat: boolean;
  showToken: boolean;
  defaulted: boolean; // 是否已初始化 只运行一次, 用于标记初始化默认配置
  language: string;
  setCurrentSessionId: (id: string) => void;
  setDefaultChat: (defaulted: boolean) => void;
  setShowToken: (showToken: boolean) => void;
  setContinuousChat: (continuousChat: boolean) => void;
  setTemperature: (temperature: number) => void;
  setMaxReplayLength: (maxReplayLength: number) => void;
  setApiKey: (key: string) => void;
  setLanguage: (language: string) => void;
}

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      currentSessionId: '',
      apiKey: '',
      temperature: 0.6,
      maxReplayLength: 1024,
      continuousChat: true,
      showToken: false,
      defaulted: false,
      language: 'zh-Hans',
      setContinuousChat: (continuousChat: boolean) => set(() => ({ continuousChat })),
      setCurrentSessionId: (id: string) => set(() => ({ currentSessionId: id })),
      setLanguage: (language: string) => set(() => ({ language })),
      setDefaultChat: (defaulted: boolean) => set(() => ({ defaulted })),
      setShowToken: (showToken: boolean) => set(() => ({ showToken })),
      setTemperature: (temperature: number) => set(() => ({ temperature })),
      setMaxReplayLength: (maxReplayLength: number) => set(() => ({ maxReplayLength })),
      setApiKey: (key: string) => set(() => ({ apiKey: key })),
    }),
    {
      name: 'setting',
    },
  ),
);
