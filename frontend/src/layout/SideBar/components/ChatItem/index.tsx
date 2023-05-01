import { FC } from 'react';
import classNames from 'classnames/bind';
import Icon from '@/components/Icon';
import Dropdown from '@/components/Dropdown';
import { dropdownItems } from '@/config/config';
import Whether from '@/components/Whether';
import { useModalStore } from '@/store/modal';
import { useChatSessionStore } from '@/store/chat';
import style from './style/index.module.scss';
import { nanoId, timestamp } from '@/utils/utils';
import { chatSessionDB } from '@/db';
const cn = classNames.bind(style);
interface ChatItemProps {
  text: string;
  id: number;
  chatId: string;
  prefix?: string;
  collapse?: boolean;
  checked?: boolean;
  onClick?: () => void;
}
const ChatItem: FC<ChatItemProps> = (props) => {
  const { text, prefix, collapse, checked } = props;
  const { chatList, setChatList, setSession } = useChatSessionStore((state) => state);
  const { setRoleAction, setRoleModalInfo, toggleRoleModal } = useModalStore((state) => state);
  const dropdownItemClickHandler = async (key: string) => {
    if (key === 'edit') {
      const roleInfo = chatList.find((item) => item.chatId === props.chatId);
      setRoleModalInfo({
        id: props.id,
        name: roleInfo?.name || '',
        description: roleInfo?.description || '',
        avatarName: roleInfo?.avatarName || '',
      });
      setRoleAction('edit');
      toggleRoleModal(true);
    } else if (key === 'copy') {
      const target = chatList.find((item) => item.chatId === props.chatId);
      if (!target) return;
      const chatItem = {
        chatId: nanoId(),
        name: target.name + ' copied',
        description: target.description,
        avatarName: target.avatarName,
        list: [],
        createAt: timestamp(),
      };
      const id = await chatSessionDB.create(chatItem);
      setChatList([...chatList, { ...chatItem, id: id as number }]);
    } else if (key === 'delete') {
      chatSessionDB.remove(props.id);
      const newChatList = chatList.filter((item) => item.chatId !== props.chatId);
      setChatList(newChatList);
      setSession({
        id: 0,
        chatId: '',
        name: '',
        avatarName: '',
        description: '',
        list: [],
        createAt: 0,
      });
    }
  };
  return (
    <div className={cn('chat-item', { 'chat-item__collapse': collapse, 'chat-item__checked': checked })}>
      <div className={cn('chat-item__left', 'flex items-center flex-1')} onClick={props.onClick}>
        <img className={cn('chat-item__prefix')} src={prefix}></img>
        <span className="inline-block text-ellipsis overflow-hidden whitespace-nowrap">{text}</span>
      </div>
      <Whether condition={!collapse}>
        <Dropdown items={dropdownItems} itemOnClick={dropdownItemClickHandler}>
          <div className="mx-[12px]">
            <Icon name="more-line" color="var(--assist-color)" />
          </div>
        </Dropdown>
      </Whether>
    </div>
  );
};

export default ChatItem;
