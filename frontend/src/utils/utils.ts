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

// 获取指定日期前prev个月的日期
export const prevDateByMonth = (date: Date, prev: number): Date => {
  const newMonth = date.getMonth() - prev;
  const newYear = newMonth < 0 ? date.getFullYear() - 1 : date.getFullYear();
  const correctedMonth = (newMonth + 12) % 12;

  return new Date(
    newYear,
    correctedMonth,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  );
};

// 获取指定日期的后next个月的日期
export const nextDateByMonth = (date: Date, next: number): Date => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();

  const newMonth = month + next;
  const newYear = year + Math.floor(newMonth / 12);
  const newMonthOfYear = newMonth % 12;
  return new Date(newYear, newMonthOfYear, day, hour, minute, second, millisecond);
};
