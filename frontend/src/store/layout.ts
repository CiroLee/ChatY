import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutStore {
  collapse: boolean;
  toggleCollapse: () => void;
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      collapse: false,
      toggleCollapse: () => set((state) => ({ collapse: !state.collapse })),
    }),
    {
      name: 'sidebar-collapse',
    },
  ),
);
