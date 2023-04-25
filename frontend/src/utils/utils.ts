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
