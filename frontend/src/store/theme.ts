import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setThemeClass } from '../utils/chat';
interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'auto',
      setTheme: (theme: string) =>
        set(() => {
          setThemeClass(theme);
          return { theme };
        }),
    }),
    {
      name: 'theme',
    },
  ),
);
