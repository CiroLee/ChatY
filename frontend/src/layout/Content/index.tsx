import { FC, useState } from 'react';
import { useToggle } from 'react-use';
import RoleModal from './components/RoleModal';
import SettingModal from './components/SettingModal';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
import Icon from '@/components/Icon';
const cn = classNames.bind(style);
const Content: FC = () => {
  const [showRoleModal, toggleRoleModal] = useToggle(false);
  const [showSettingModal, toggleSettingModal] = useToggle(false);
  const [roleAction, setRoleAction] = useState<'create' | 'edit'>('create');
  const [roleModalTitle, setRoleModalTitle] = useState('');
  const createRole = () => {
    toggleRoleModal(true);
    setRoleModalTitle('创建角色');
    setRoleAction('create');
  };
  return (
    <div className="h-full relative flex-1 bg-[var(--content-bg)]">
      <div className={cn('session-header')}>
        <h3 className="text-[18px]">chat1</h3>
        <div className="flex items-center h-full">
          <Icon name="add-line" size="18px" onClick={createRole} />
          <Icon name="settings-3-line" size="18px" className="ml-[12px]" onClick={() => toggleSettingModal(true)} />
        </div>
      </div>
      <RoleModal
        title={roleModalTitle}
        action={roleAction}
        show={showRoleModal}
        onCancel={() => toggleRoleModal(false)}
      />
      <SettingModal show={showSettingModal} onCancel={() => toggleSettingModal(false)} />
    </div>
  );
};

export default Content;
