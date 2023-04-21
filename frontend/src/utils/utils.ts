import { avatars } from '@/config/config';
export const isMac = () => {
  const ua = navigator.userAgent;
  return /macintosh|mac os x/i.test(ua);
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

export const getAvatarUrl = (avatarName: string) => {
  return avatars.find((arr) => arr[0] === avatarName)?.[1] || '';
};

// get apiKey from the storage
export const getApiKey = () => {
  const settingStr = window.localStorage.getItem('setting');
  const setting: { state: { apiKey: string } } = JSON.parse(settingStr || '{}');
  return setting.state.apiKey || '';
};
