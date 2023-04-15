import { FC } from 'react';
import { useToggle } from 'react-use';
import RoleModal from './components/RoleModal';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
import Icon from '@/components/Icon';
const cn = classNames.bind(style);
const Content: FC = () => {
  const [showRoleModal, toggleRoleModal] = useToggle(true);
  return (
    <div className="h-full relative flex-1 bg-[var(--content-bg)]">
      <div className={cn('session-header')}>
        <h3 className="text-[18px]">chat1</h3>
        <div className="flex items-center h-full">
          <Icon name="add-line" size="18px" onClick={() => toggleRoleModal(true)} />
          <Icon name="settings-3-line" size="18px" className="ml-[12px]" />
        </div>
      </div>
      <RoleModal title="创建角色" show={showRoleModal} onCancel={() => toggleRoleModal(false)} />
    </div>
  );
};

export default Content;
