import { FC } from 'react';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
import Icon from '@/components/Icon';
import Dropdown from '@/components/Dropdown';
import { dropdownItems } from '@/config/config';
const cn = classNames.bind(style);
interface ChatItemProps {
  text: string;
  id: string;
  prefix?: string;
  collapse?: boolean;
}
const ChatItem: FC<ChatItemProps> = (props) => {
  const { text, prefix = '#333', collapse } = props;

  const dropdownItemClickHandler = (key: string) => {
    console.log(key, props.id);
  };
  return (
    <div className={cn('chat-item', { 'chat-item__collapse': collapse })}>
      <div className={cn('chat-item__left', 'flex items-center flex-1')}>
        <div className={cn('chat-item__prefix')} style={{ backgroundColor: prefix }}></div>
        <span className="inline-block whitespace-nowrap">{text}</span>
      </div>
      <Dropdown items={dropdownItems} itemOnClick={dropdownItemClickHandler}>
        <div className="ml-2">
          <Icon name="more-line" color="var(--assist-color)" />
        </div>
      </Dropdown>
    </div>
  );
};

export default ChatItem;
