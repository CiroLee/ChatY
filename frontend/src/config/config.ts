import AvatarAssist from '@/assets/avatars/avatar-assist.png';
import AvatarAtom from '@/assets/avatars/avatar-atom.png';
import AvatarCalculator from '@/assets/avatars/avatar-calculator.png';
import AvatarCat from '@/assets/avatars/avatar-cat.png';
import AvatarCode from '@/assets/avatars/avatar-code.png';
import AvatarDog from '@/assets/avatars/avatar-dog.png';
import AvatarIdea from '@/assets/avatars/avatar-idea.png';
import AvatarKetty from '@/assets/avatars/avatar-ketty.png';
import AvatarMario from '@/assets/avatars/avatar-mario.png';
import AvatarSimpson from '@/assets/avatars/avatar-simpson.png';

export const themeChangeTabs = [
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

export const dropdownItems = [
  {
    key: 'edit',
    label: '编辑',
    icon: 'edit-line',
  },
  {
    key: 'copy',
    label: '复制',
    icon: 'file-copy-line',
  },
  {
    key: 'delete',
    label: '删除',
    icon: 'delete-bin-5-line',
    color: '#FA6E6E',
  },
];

export const avatars: string[][] = [
  ['avatar-idea', AvatarIdea],
  ['avatar-assist', AvatarAssist],
  ['avatar-atom', AvatarAtom],
  ['avatar-calculator', AvatarCalculator],
  ['avatar-cat', AvatarCat],
  ['avatar-code', AvatarCode],
  ['avatar-dog', AvatarDog],
  ['avatar-ketty', AvatarKetty],
  ['avatar-mario', AvatarMario],
  ['avatar-simpson', AvatarSimpson],
];
