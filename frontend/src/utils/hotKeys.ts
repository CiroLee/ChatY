import { HotkeyCallback } from 'react-hotkeys-hook/dist/types';
import { useHotkeys } from 'react-hotkeys-hook';
import { isMac } from './utils';

interface HotKeysOption {
  keys: string | string[];
  callback: HotkeyCallback;
}
interface GlobalHotKeys {
  global?: HotKeysOption[];
  win?: HotKeysOption[];
  mac?: HotKeysOption[];
}
export const globalHotKeysRegister = (options: GlobalHotKeys) => {
  Object.entries(options).forEach(([key, value]) => {
    switch (key) {
      case 'global':
        value.forEach((item: HotKeysOption) => {
          useHotkeys(item.keys, item.callback);
        });
        break;
      case 'win':
        if (!isMac()) {
          value.forEach((item: HotKeysOption) => {
            useHotkeys(item.keys, item.callback);
          });
        }
        break;
      case 'mac':
        if (isMac()) {
          value.forEach((item: HotKeysOption) => {
            useHotkeys(item.keys, item.callback);
          });
        }
        break;
    }
  });
};
