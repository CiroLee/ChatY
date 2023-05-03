import { FC } from 'react';
import { useTranslation } from 'react-i18next';
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
    <div className="text-[15px] grid gap-1 grid-cols-2 text-gray-400 mb-3">
      <div className="min-w-[100px]">
        <span className="inline-block py-[1px] px-[6px] rounded-[2px] bg-[var(--shortcut-bg)]">{props.keys}</span>
      </div>
      <span className="">{props.text}</span>
    </div>
  );
};
const SimpleShortcuts: FC<SimpleShortcutsProps> = (props) => {
  const { t } = useTranslation();
  const _hotKeysConfig = hotKeysConfig(isMac(), t);
  return (
    <div className={classNames(props.className, 'flex flex-col justify-center items-center')}>
      {_hotKeysConfig.simpleShortCuts.map((item) => (
        <ShortcutItem key={item.keys} keys={item.keys} text={item.text} />
      ))}
    </div>
  );
};

export default SimpleShortcuts;
