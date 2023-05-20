import Confirm from '@/components/Confirm';
import Dropdown from '@/components/Dropdown';
import Icon from '@/components/Icon';
import Whether from '@/components/Whether';
import { dropdownItems } from '@/config/config';
import { chatSessionDB } from '@/db';
import { useChatSessionStore } from '@/store/chat';
import { useModalStore } from '@/store/modal';
import { nanoId, timestamp } from '@/utils/utils';
import classNames from 'classnames/bind';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './style/index.module.scss';
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
  const { text, prefix, collapse, checked, continuousChat = false } = props;
  const [showConfirm, setShowConfirm] = useState(false);
  const { chatList, setChatList, setSession } = useChatSessionStore((state) => state);
  const { setRoleAction, setRoleModalInfo, toggleRoleModal } = useModalStore((state) => state);
  const { t } = useTranslation();
  const _dropdownItems = dropdownItems(t);

  const dropdownItemClickHandler = async (key: string) => {
    const roleInfo = chatList.find((item) => item.chatId === props.chatId);
    if (!roleInfo) return;
    if (key === 'edit') {
      setRoleModalInfo({
        id: props.id,
        name: roleInfo?.name || '',
        description: roleInfo?.description || '',
        avatarName: roleInfo?.avatarName || '',
        temperature: roleInfo?.temperature,
        maxToken: roleInfo?.maxToken,
        continuousChat: roleInfo?.continuousChat,
      });
      setRoleAction('edit');
      toggleRoleModal(true);
    } else if (key === 'copy') {
      const chatItem = {
        chatId: nanoId(),
        name: roleInfo.name + ' copied',
        description: roleInfo.description,
        avatarName: roleInfo.avatarName,
        temperature: roleInfo?.temperature,
        maxToken: roleInfo?.maxToken,
        continuousChat: roleInfo?.continuousChat,
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
  return (
    <div className={cn('chat-item', { 'chat-item__collapse': collapse, 'chat-item__checked': checked })}>
      <div className={cn('chat-item__left', 'flex items-center flex-1')} onClick={props.onClick}>
        <img className={cn('chat-item__prefix')} src={prefix}></img>
        <span className="inline-block text-ellipsis overflow-hidden whitespace-nowrap">{text}</span>
      </div>
      <Whether condition={!collapse}>
        <Whether condition={continuousChat}>
          <Icon name="outlet-fill" color="var(--brand-color)" />
        </Whether>
        <Dropdown items={_dropdownItems} itemOnClick={dropdownItemClickHandler}>
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
