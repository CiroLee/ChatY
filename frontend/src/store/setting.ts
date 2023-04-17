import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface SettingStore {
  temperature: number;
  maxReplayLength: number;
  setTemperature: (temperature: number) => void;
  setMaxReplayLength: (maxReplayLength: number) => void;
}

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      temperature: 0.6,
      maxReplayLength: 2048,
      setTemperature: (temperature: number) => set(() => ({ temperature })),
      setMaxReplayLength: (maxReplayLength: number) => set(() => ({ maxReplayLength })),
    }),
    {
      name: 'setting',
    },
  ),
);
