import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export interface SettingStore {
  apiKey: string;
  temperature: number;
  maxReplayLength: number;
  contextRange: number;
  setTemperature: (temperature: number) => void;
  setMaxReplayLength: (maxReplayLength: number) => void;
  setApiKey: (key: string) => void;
  setContextRange: (range: number) => void;
}

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      apiKey: '',
      temperature: 0.6,
      maxReplayLength: 1024,
      contextRange: 50,
      setTemperature: (temperature: number) => set(() => ({ temperature })),
      setMaxReplayLength: (maxReplayLength: number) => set(() => ({ maxReplayLength })),
      setApiKey: (key: string) => set(() => ({ apiKey: key })),
      setContextRange: (range: number) => set(() => ({ contextRange: range })),
    }),
    {
      name: 'setting',
    },
  ),
);
