import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface SettingStore {
  apiKey: string;
  temperature: number;
  maxReplayLength: number;
  setTemperature: (temperature: number) => void;
  setMaxReplayLength: (maxReplayLength: number) => void;
  setApiKey: (key: string) => void;
}

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      apiKey: '',
      temperature: 0.6,
      maxReplayLength: 2048,
      setTemperature: (temperature: number) => set(() => ({ temperature })),
      setMaxReplayLength: (maxReplayLength: number) => set(() => ({ maxReplayLength })),
      setApiKey: (key: string) => set(() => ({ apiKey: key })),
    }),
    {
      name: 'setting',
    },
  ),
);
