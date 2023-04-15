import { FC } from 'react';
import Popup from '@/components/Popup';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
const cn = classNames.bind(style);

interface RoleModalProps {
  title?: string;
  show: boolean;
  onCancel: () => void;
}
const RoleModal: FC<RoleModalProps> = (props) => {
  const { show, onCancel, title } = props;
  return (
    <Popup show={show} placement="center" maskClosable={true} cancel={onCancel}>
      <div className={cn('role-modal')}>
        <h3>{title}</h3>
      </div>
    </Popup>
  );
};

export default RoleModal;
