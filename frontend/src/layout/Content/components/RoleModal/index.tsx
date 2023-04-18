import { FC, useState } from 'react';
import Popup from '@/components/Popup';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
const cn = classNames.bind(style);

interface RoleModalProps {
  title?: string;
  action: 'create' | 'edit';
  show: boolean;
  onCancel: () => void;
}
const RoleModal: FC<RoleModalProps> = (props) => {
  const { show, onCancel, title } = props;
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  return (
    <Popup show={show} placement="center" maskClosable={true} cancel={onCancel}>
      <div className={cn('role-modal')}>
        <h3>{title}</h3>
        <div className="mt-6">
          <div className="flex items-center">
            <label>名称</label>
            <Input
              className="flex-1 ml-3"
              maxLength={20}
              clearable
              placeholder="请输入名称"
              showCount
              value={name}
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
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" className="ml-2">
              确认
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default RoleModal;
