import { create } from 'zustand';

interface LayoutStore {
  collapse: boolean;
  titleBarHeight: number;
  toggleCollapse: () => void;
  setTitleBarHeight: (height: number) => void;
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  collapse: false,
  titleBarHeight: 0,
  toggleCollapse: () => set((state) => ({ collapse: !state.collapse })),
  setTitleBarHeight: (height: number) => set(() => ({ titleBarHeight: height })),
}));
