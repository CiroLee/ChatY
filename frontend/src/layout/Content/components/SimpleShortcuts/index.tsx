import { FC } from 'react';
import classNames from 'classnames';
import { isMac } from '@/utils/utils';
import { hotKeysConfig } from '@/config/config';
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
  return (
    <div className={classNames(props.className, 'flex flex-col justify-center items-center')}>
      {hotKeysConfig(isMac()).simpleShortCuts.map((item) => (
        <ShortcutItem key={item.keys} keys={item.keys} text={item.text} />
      ))}
    </div>
  );
};

export default SimpleShortcuts;
