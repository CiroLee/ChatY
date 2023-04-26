import { create } from 'zustand';
interface RoleModalInfo {
  id: number;
  name: string;
  description: string;
  avatarName: string;
}
interface ModalStore {
  showRoleModal: boolean;
  roleAction: 'create' | 'edit';
  showSettingModal: boolean;
  roleModalInfo: RoleModalInfo;
  setRoleAction: (action: 'create' | 'edit') => void;
  toggleRoleModal: (show?: boolean) => void;
  toggleSettingModal: (show?: boolean) => void;
  setRoleModalInfo: (info: RoleModalInfo) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  roleModalInfo: {
    id: 0,
    name: '',
    description: '',
    avatarName: '',
  },
  roleAction: 'create',
  showRoleModal: false,
  showSettingModal: false,
  setRoleAction: (action: 'create' | 'edit') => set(() => ({ roleAction: action })),
  toggleRoleModal: (show?: boolean) => set((state) => ({ showRoleModal: show ?? !state.showRoleModal })),
  toggleSettingModal: (show?: boolean) => set((state) => ({ showSettingModal: show ?? !state.showSettingModal })),
  setRoleModalInfo: (info: RoleModalInfo) => set(() => ({ roleModalInfo: info })),
}));
