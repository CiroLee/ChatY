import { avatars } from '@/config/config';
export const getAvatarUrl = (avatarName?: string) => {
  return avatars.find((arr) => arr[0] === avatarName)?.[1] || '';
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
