import AvatarAssist from '@/assets/avatars/avatar-assist.png';
import AvatarAtom from '@/assets/avatars/avatar-atom.png';
import AvatarCalculator from '@/assets/avatars/avatar-calculator.png';
import AvatarCode from '@/assets/avatars/avatar-code.png';
import AvatarDog from '@/assets/avatars/avatar-dog.png';
import AvatarHammer from '@/assets/avatars/avatar-hammer.png';
import AvatarIdea from '@/assets/avatars/avatar-idea.png';
import AvatarKitty from '@/assets/avatars/avatar-kitty.png';
import AvatarMario from '@/assets/avatars/avatar-mario.png';
import AvatarPi from '@/assets/avatars/avatar-pi.png';
import AvatarSimpson from '@/assets/avatars/avatar-simpson.png';
import AvatarTranslate from '@/assets/avatars/avatar-translate.png';
import { HotKeysMap } from '@/types/config';

import type { TabItem } from '@/components/RadioTabs';
import { Option } from '@/types/common';
import type { ChatSession } from '@/types/db';
import type { TFunction } from 'i18next';
import { DropdownItem } from '@/components/Dropdown';

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

export const languageTabs: TabItem[] = [
  {
    value: 'zh-Hans',
    label: '简体中文',
  },
  {
    value: 'en',
    label: 'English',
  },
];

export const helpChangeTabs = (t: TFunction): TabItem[] => {
  return [
    {
      value: 'hotkeys',
      icon: 'command-line',
      label: t('about.shortcuts') || '',
    },
    {
      value: 'account',
      icon: 'account-circle-line',
      label: t('about.account') || '',
    },
    {
      value: 'about',
      icon: 'information-line',
      label: t('about.about') || '',
    },
  ];
};

export const accountRange = (t: TFunction): Option[] => {
  return [
    {
      label: t('account.oneMonth') || '',
      value: 1,
    },
    {
      label: t('account.twoMonth') || '',
      value: 2,
    },
    {
      label: t('account.threeMonth') || '',
      value: 3,
    },
  ];
};

export const dropdownItems = (t: TFunction): DropdownItem[] => {
  return [
    {
      key: 'edit',
      label: t('dropdown.edit'),
      icon: 'edit-line',
    },
    {
      key: 'copy',
      label: t('dropdown.copy'),
      icon: 'file-copy-line',
    },
    {
      key: 'delete',
      label: t('dropdown.delete'),
      icon: 'delete-bin-5-line',
      color: '#FA6E6E',
    },
  ];
};

export const hotKeysConfig = (isMac: boolean, t: TFunction): HotKeysMap => {
  return {
    simpleShortCuts: [
      {
        keys: isMac ? '⌘ + N' : 'Ctrl + N',
        text: t('hotkeys.newRole'),
      },
      {
        keys: isMac ? '⌘ + X' : 'Ctrl + X',
        text: t('hotkeys.openSetting'),
      },
      {
        keys: isMac ? '⌘ + H' : 'Ctrl + H',
        text: t('hotkeys.help'),
      },
    ],
    layout: [
      {
        keys: isMac ? '⌘ + B' : 'Ctrl + B',
        text: t('hotkeys.toggleSidebar'),
      },
    ],
    editor: [
      {
        keys: isMac ? '⌘ + J' : 'Ctrl + J',
        text: t('hotkeys.toggleInputMode'),
      },
      {
        keys: 'Enter',
        text: t('hotkeys.enter'),
      },
      {
        keys: 'Shift + Enter',
        text: t('hotkeys.shiftEnter'),
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
  ['avatar-code', AvatarCode],
  ['avatar-dog', AvatarDog],
  ['avatar-kitty', AvatarKitty],
  ['avatar-mario', AvatarMario],
  ['avatar-simpson', AvatarSimpson],
  ['avatar-pi', AvatarPi],
  ['avatar-hammer', AvatarHammer],
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
