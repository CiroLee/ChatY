import { avatars } from '@/config/config';
import type { SettingStore } from '@/store/setting';
export const getAvatarUrl = (avatarName?: string) => {
  return avatars.find((arr) => arr[0] === avatarName)?.[1] || '';
};

// get apiKey from the storage
export const getSettingStorage = () => {
  const settingStr = window.localStorage.getItem('setting');
  const setting: { state: SettingStore } = JSON.parse(settingStr || '{}');
  return setting.state;
};

export const setThemeClass = (theme: string) => {
  const darkMatches = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = darkMatches.matches;
  if (theme === 'auto') {
    isDark ? (document.body.className = 'dark') : document.body.classList.remove('dark');
  } else {
    theme === 'dark' ? (document.body.className = 'dark') : document.body.classList.remove('dark');
  }
};
