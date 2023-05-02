import AvatarAssist from '@/assets/avatars/avatar-assist.png';
import AvatarAtom from '@/assets/avatars/avatar-atom.png';
import AvatarCalculator from '@/assets/avatars/avatar-calculator.png';
import AvatarCat from '@/assets/avatars/avatar-cat.png';
import AvatarCode from '@/assets/avatars/avatar-code.png';
import AvatarDog from '@/assets/avatars/avatar-dog.png';
import AvatarIdea from '@/assets/avatars/avatar-idea.png';
import AvatarKitty from '@/assets/avatars/avatar-kitty.png';
import AvatarMario from '@/assets/avatars/avatar-mario.png';
import AvatarSimpson from '@/assets/avatars/avatar-simpson.png';
import AvatarTranslate from '@/assets/avatars/avatar-translate.png';
import { HotKeysMap } from '@/types/config';
import type { TabItem } from '@/components/RadioTabs';
import { ChatSession } from '@/types/db';

export const themeChangeTabs: TabItem[] = [
  {
    value: 'auto',
    icon: 'contrast-line',
  },
  {
    value: 'light',
    icon: 'sun-line',
  },
  {
    value: 'dark',
    icon: 'moon-line',
  },
];

export const helpChangeTabs: TabItem[] = [
  {
    value: 'hotkeys',
    icon: 'command-line',
    label: '快捷键',
  },
  {
    value: 'about',
    icon: 'information-line',
    label: '关于',
  },
];

export const dropdownItems = [
  {
    key: 'edit',
    label: '编辑',
    icon: 'edit-line',
  },
  {
    key: 'copy',
    label: '复制',
    icon: 'file-copy-line',
  },
  {
    key: 'delete',
    label: '删除',
    icon: 'delete-bin-5-line',
    color: '#FA6E6E',
  },
];

export const hotKeysConfig = (isMac: boolean): HotKeysMap => {
  return {
    simpleShortCuts: [
      {
        keys: isMac ? '⌘ + N' : 'Ctrl + N',
        text: '新建角色',
      },
      {
        keys: isMac ? '⌘ + X' : 'Ctrl + X',
        text: '打开设置',
      },
      {
        keys: isMac ? '⌘ + H' : 'Ctrl + H',
        text: '查看帮助',
      },
    ],
    layout: [
      {
        keys: isMac ? '⌘ + B' : 'Ctrl + B',
        text: '收起/展开侧边栏',
      },
    ],
    editor: [
      {
        keys: isMac ? '⌘ + J' : 'Ctrl + J',
        text: '切换半屏/原始输入',
      },
      {
        keys: 'Enter',
        text: '发送信息',
      },
      {
        keys: 'Shift + Enter',
        text: '换行',
      },
    ],
  };
};

export const avatars: string[][] = [
  ['avatar-idea', AvatarIdea],
  ['avatar-assist', AvatarAssist],
  ['avatar-atom', AvatarAtom],
  ['avatar-calculator', AvatarCalculator],
  ['avatar-translate', AvatarTranslate],
  ['avatar-cat', AvatarCat],
  ['avatar-code', AvatarCode],
  ['avatar-dog', AvatarDog],
  ['avatar-kitty', AvatarKitty],
  ['avatar-mario', AvatarMario],
  ['avatar-simpson', AvatarSimpson],
];

// 初始化的默认chat
export const defaultChat: Omit<ChatSession, 'id'> = {
  chatId: 'default-001',
  avatarName: 'avatar-idea',
  createAt: 0,
  name: '智能问答助手',
  list: [],
  description: 'You are an intelligent quiz assistant. You will answer any question I ask.',
};
