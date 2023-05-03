import { FC, useEffect, useState } from 'react';
import Message from '@/components/Message';
import Popup from '@/components/Popup';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import { chatSessionDB } from '@/db';
import classNames from 'classnames/bind';
import { avatars } from '@/config/config';
import style from './style/index.module.scss';
import { nanoId, timestamp } from '@/utils/utils';
import { useChatSessionStore } from '@/store/chat';
import { useSettingStore } from '@/store/setting';
import { useModalStore } from '@/store/modal';
import { useTranslation } from 'react-i18next';
const cn = classNames.bind(style);

interface RoleModalProps {
  action: 'create' | 'edit';
  show: boolean;
  name?: string;
  description?: string;
  avatarName?: string;
  onCancel: () => void;
}
const defaultAvatarKey = avatars[0][0];
const RoleModal: FC<RoleModalProps> = (props) => {
  const { show, onCancel, action, name = '', avatarName, description = '' } = props;
  const [roleName, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const { chatList, setChatList } = useChatSessionStore((state) => state);
  const { language } = useSettingStore((state) => state);
  const { roleModalInfo } = useModalStore((state) => state);
  const message = new Message();
  const { t } = useTranslation();
  const handleChooseAvatar = (name: string) => {
    setSelectedAvatar(name);
  };
  const createRole = async () => {
    try {
      const chatItem = {
        chatId: nanoId(),
        name: roleName,
        description: desc,
        avatarName: selectedAvatar,
        list: [],
        createAt: timestamp(),
      };
      const id = await chatSessionDB.create(chatItem);
      setChatList([...chatList, { ...chatItem, id: id as number }]);

      message.success(t('message.createSucceed'));
    } catch (error) {
      console.error(error);
    }
  };

  const editRole = async () => {
    try {
      const updatedData = {
        name: roleName,
        description: desc,
        avatarName: selectedAvatar,
      };
      const newChatList = chatList.map((item) => {
        if (item.id === roleModalInfo.id) {
          return { ...item, ...updatedData };
        }
        return item;
      });
      await chatSessionDB.update(roleModalInfo.id, updatedData);
      setChatList(newChatList);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnCancel = () => {
    onCancel();
  };
  const handleOk = async () => {
    if (!roleName) {
      message.warn(t('message.warnOfEmptyName'));
      return;
    }
    if (action === 'create') {
      createRole();
    } else if (action === 'edit') {
      editRole();
    }
    handleOnCancel();
  };
  useEffect(() => {
    setName(name);
    setDesc(description);
    setSelectedAvatar(avatarName || defaultAvatarKey);
  }, [show]);

  return (
    <Popup show={show} placement="center" maskClosable={true} cancel={handleOnCancel}>
      <div className={cn('role-modal')}>
        <h3>{action === 'create' ? t('modal.createRole') : t('modal.modifyRole')}</h3>
        <div className="mt-6">
          <div className="flex items-center">
            <label className={cn({ 'w-[70px]': language === 'en' })}>{t('global.avatar')}</label>
            <div className="ml-3">
              {avatars.map((arr) => (
                <Avatar
                  key={arr[0]}
                  url={arr[1]}
                  checked={arr[0] === selectedAvatar}
                  size="small"
                  onClick={() => handleChooseAvatar(arr[0])}
                  className="mr-2 cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center">
            <label className={cn({ 'w-[70px]': language === 'en' })}>{t('global.name')}</label>
            <Input
              className="flex-1 ml-3"
              maxLength={20}
              clearable
              placeholder={t('modal.placeholderInputName') || ''}
              showCount
              value={roleName}
              onChange={setName}
            />
          </div>
          <div className="flex mt-4">
            <label className={cn('mt-1', { ' w-[70px]': language === 'en' })}>{t('global.description')}</label>
            <Textarea
              className="flex-1 ml-3"
              maxLength={1000}
              clearable
              showCount
              placeholder={t('modal.placeholderInputDescription') || ''}
              value={desc}
              onChange={setDesc}
            />
          </div>
          <div className="flex justify-end mt-[44px]">
            <Button onClick={handleOnCancel}>{t('global.cancel')}</Button>
            <Button type="primary" className="ml-2" onClick={handleOk}>
              {t('global.confirm')}
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default RoleModal;
