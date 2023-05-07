import { avatars } from '@/config/config';
import { chatSessionDB } from '@/db';
import { useChatSessionStore } from '@/store/chat';
import { omit } from 'fe-gear';
import { SaveFile } from '@wails/go/app/App';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { ChatItem } from '@/types/db';
const { changeChatStatus } = useChatSessionStore.getState();

const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
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

export const saveSessionDB = () => {
  const data = useChatSessionStore.getState().session;
  chatSessionDB.update(data.id, omit(data, ['id']));
  changeChatStatus('done');
};

export const tokenNum = (str: string): number => {
  const encoded = tokenizer.encode(str);
  return tokenizer.decode(encoded.bpe).length;
};

export const exportChatUtil = (list: ChatItem[], botName: string, callback?: () => void) => {
  let mdData = '';
  list.forEach((item) => {
    if (item.role === 'assistant') {
      mdData += `**${botName}**:\n\n${item.content}\n\n`;
    } else {
      mdData += `**${item.role}**:\n\n${item.content}\n\n`;
    }
  });
  SaveFile(mdData)
    .then(() => callback && callback())
    .catch((err) => console.error(err));
};
