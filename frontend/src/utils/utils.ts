/**
 * description: common function utils
 */
import type { ObjType } from '@/types/common';
import { customAlphabet } from 'nanoid';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'; // for nanoid
export const isMac = () => {
  const ua = navigator.userAgent;
  return /macintosh|mac os x/i.test(ua);
};

export const nanoId = (num = 12) => {
  return customAlphabet(alphabet, num)();
};

export const omit = <T>(obj: ObjType, arr: string[]): T => {
  if (!Array.isArray(arr)) return obj;
  return Object.keys(obj)
    .filter((key) => !arr.includes(key))
    .reduce((acc: ObjType, key: string) => ((acc[key] = obj[key]), acc), {});
};
