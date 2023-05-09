/**
 * description: common function utils
 */
import { customAlphabet } from 'nanoid';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'; // for nanoid
export const isMac = () => {
  const ua = navigator.userAgent;
  return /macintosh|mac os x/i.test(ua);
};

export const nanoId = (num = 12) => {
  return customAlphabet(alphabet, num)();
};

export const timestamp = () => {
  return Date.parse(new Date().toString()) / 1000;
};

export const copyToClipboard = async (text: string): Promise<{ value: string; error: Error | unknown | undefined }> => {
  try {
    await window.navigator.clipboard.writeText(text);
    return { value: text, error: undefined };
  } catch (error) {
    return { value: '', error };
  }
};
