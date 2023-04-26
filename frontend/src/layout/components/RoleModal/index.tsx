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
import { useModalStore } from '@/store/modal';
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
  const { show, onCancel, action, name = '', avatarName = '', description = '' } = props;
  const [roleName, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatarKey);
  const { chatList, setChatList } = useChatSessionStore((state) => state);
  const { roleModalInfo } = useModalStore((state) => state);
  const message = new Message();
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

      message.success('创建成功');
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

  const clear = () => {
    setName('');
    setDesc('');
    setSelectedAvatar(defaultAvatarKey);
  };
  const handleOnCancel = () => {
    clear();
    onCancel();
  };
  const handleOk = async () => {
    console.log(roleName, desc, selectedAvatar);
    if (!roleName) {
      message.warn('名称不能为空');
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
  }, [name, description, avatarName]);
  return (
    <Popup show={show} placement="center" maskClosable={true} cancel={handleOnCancel}>
      <div className={cn('role-modal')}>
        <h3>{action === 'create' ? '创建角色' : '修改角色'}</h3>
        <div className="mt-6">
          <div className="flex items-center">
            <label>头像</label>
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
            <label>名称</label>
            <Input
              className="flex-1 ml-3"
              maxLength={20}
              clearable
              placeholder="请输入名称"
              showCount
              value={roleName}
              onChange={setName}
            />
          </div>
          <div className="flex mt-4">
            <label className="mt-1">描述</label>
            <Textarea
              className="flex-1 ml-3"
              maxLength={140}
              clearable
              showCount
              placeholder="请输入描述"
              value={desc}
              onChange={setDesc}
            />
          </div>
          <div className="flex justify-end mt-[44px]">
            <Button onClick={handleOnCancel}>取消</Button>
            <Button type="primary" className="ml-2" onClick={handleOk}>
              确认
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default RoleModal;
