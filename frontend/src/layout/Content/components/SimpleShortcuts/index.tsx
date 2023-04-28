import { FC } from 'react';
import classNames from 'classnames';
import { isMac } from '@/utils/utils';
import { useSettingStore } from '@/store/setting';
import { hotKeysConfig } from '@/config/config';
import Icon from '@/components/Icon';
import Whether from '@/components/Whether';
interface SimpleShortcutsProps {
  className?: string;
}

interface ShortcutItemProps {
  keys: string;
  text: string;
}

const ShortcutItem: FC<ShortcutItemProps> = (props) => {
  return (
    <div className="text-[15px] text-gray-400 mb-3">
      <span className="inline-block py-[1px] px-[6px] rounded-[2px] bg-[var(--shortcut-bg)]">{props.keys}</span>
      <span className="ml-8">{props.text}</span>
    </div>
  );
};
const SimpleShortcuts: FC<SimpleShortcutsProps> = (props) => {
  const { apiKey } = useSettingStore((state) => state);
  return (
    <div className={classNames(props.className, 'flex flex-col justify-center items-center')}>
      <Whether condition={!apiKey}>
        <div className="h-[36px] flex items-center px-4 text-[var(--message-warn-border-color)] mb-3">
          <span>还未设置ApiKey，请点击右上角的</span>
          <Icon name="settings-3-line" size="18px" />
          <span>设置{apiKey}</span>
        </div>
      </Whether>
      {hotKeysConfig(isMac()).simpleShortCuts.map((item) => (
        <ShortcutItem key={item.keys} keys={item.keys} text={item.text} />
      ))}
    </div>
  );
};

export default SimpleShortcuts;
