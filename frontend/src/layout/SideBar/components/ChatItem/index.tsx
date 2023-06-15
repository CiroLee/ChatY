import { FC, useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import Confirm from '@/components/Confirm';
import Dropdown, { DropdownItem } from '@/components/Dropdown';
import Icon from '@/components/Icon';
import Whether from '@/components/Whether';
import { dropdownItems } from '@/config/config';
import { chatSessionDB } from '@/db';
import { useChatSessionStore } from '@/store/chat';
import { useModalStore } from '@/store/modal';
import { nanoId, timestamp } from '@/utils/utils';
import { useTranslation } from 'react-i18next';
import style from './style/index.module.scss';
import { ChatSession } from '@/types/db';
import { sortedBypinned } from '@/utils/chat';
import { useSettingStore } from '@/store/setting';
const cn = classNames.bind(style);
interface ChatItemProps {
  text: string;
  id: number;
  chatId: string;
  prefix?: string;
  collapse?: boolean;
  checked?: boolean;
  continuousChat?: boolean;
  onClick?: () => void;
}
const ChatItem: FC<ChatItemProps> = (props) => {
  const { t } = useTranslation();
  const roleInfo = useRef<ChatSession>();
  const { text, prefix, collapse, checked } = props;
  const [showConfirm, setShowConfirm] = useState(false);
  const { language } = useSettingStore((state) => state);
  const { chatList, setChatList, setSession } = useChatSessionStore((state) => state);
  const { setRoleAction, setRoleModalInfo, toggleRoleModal } = useModalStore((state) => state);
  const _dropdownItems = dropdownItems(t);
  let pinnedVal = {
    key: 'pinned',
    label: roleInfo.current?.ispinned ? t('dropdown.unpinned') : t('dropdown.pinned'),
    icon: 'star-line',
  };

  const dropdownItemClickHandler = async (key: string) => {
    if (!roleInfo.current) return;
    // 置顶操作
    if (key === 'pinned') {
      const updatedData = {
        ...roleInfo.current,
        ispinned: !roleInfo.current.ispinned,
      };
      const newChatList = chatList.map((item) => {
        if (item.id === roleInfo.current?.id) {
          return { ...item, ...updatedData };
        }
        return item;
      });

      await chatSessionDB.update(roleInfo.current.id, updatedData);
      console.log(sortedBypinned(newChatList));

      setChatList(sortedBypinned(newChatList) as ChatSession[]);
    }
    if (key === 'edit') {
      setRoleModalInfo({
        id: props.id,
        name: roleInfo.current?.name || '',
        description: roleInfo.current.description || '',
        avatarName: roleInfo.current.avatarName || '',
        temperature: roleInfo.current.temperature,
        maxToken: roleInfo.current.maxToken,
        continuousChat: roleInfo.current?.continuousChat,
      });
      setRoleAction('edit');
      toggleRoleModal(true);
    } else if (key === 'copy') {
      const chatItem = {
        chatId: nanoId(),
        name: roleInfo.current.name + ' copied',
        description: roleInfo.current.description,
        avatarName: roleInfo.current.avatarName,
        temperature: roleInfo.current?.temperature,
        maxToken: roleInfo.current?.maxToken,
        continuousChat: roleInfo.current?.continuousChat,
        list: [],
        createAt: timestamp(),
      };
      const id = await chatSessionDB.create(chatItem);
      setChatList([...chatList, { ...chatItem, id: id as number }]);
    } else if (key === 'delete') {
      setShowConfirm(true);
    }
  };
  const confirmToDelete = () => {
    chatSessionDB.remove(props.id);
    const newChatList = chatList.filter((item) => item.chatId !== props.chatId);
    setChatList(newChatList);
    // 清空当前session
    setSession({
      id: 0,
      chatId: '',
      name: '',
      avatarName: '',
      description: '',
      list: [],
      createAt: 0,
      temperature: undefined,
      maxToken: undefined,
      continuousChat: undefined,
    });
    setShowConfirm(false);
  };

  useEffect(() => {
    roleInfo.current = chatList.find((item) => item.chatId === props.chatId);
    pinnedVal = {
      key: 'pinned',
      label: roleInfo.current?.ispinned ? t('dropdown.unpinned') : t('dropdown.pinned'),
      icon: 'star-line',
    };

    console.log(pinnedVal);
  }, [chatList, language]);

  return (
    <div
      className={cn('chat-item', {
        'chat-item__collapse': collapse,
        'chat-item__checked': checked,
      })}>
      <div className={cn('chat-item__left', 'flex items-center flex-1')} onClick={props.onClick}>
        <img className={cn('chat-item__prefix')} src={prefix}></img>
        <span className="inline-block text-ellipsis overflow-hidden whitespace-nowrap">{text}</span>
      </div>
      <Whether condition={!collapse}>
        <Whether condition={!!roleInfo.current?.ispinned}>
          <Icon name="star-fill" color="var(--brand-color)" />
        </Whether>
        <Dropdown items={[pinnedVal, ..._dropdownItems]} itemOnClick={dropdownItemClickHandler}>
          <div className={cn('chat-item__setting')}>
            <Icon name="more-line" color="var(--assist-color)" />
          </div>
        </Dropdown>
      </Whether>
      <Confirm
        type="warn"
        title={t('modal.tips')}
        show={showConfirm}
        cancelText={t('global.cancel')}
        confirmText={t('global.confirm')}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmToDelete}>
        {t('modal.warnBeforeDeleteSession')}
      </Confirm>
    </div>
  );
};

export default ChatItem;
