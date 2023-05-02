import { FC } from 'react';
import Popup from '../Popup';
import Button from '../Button';
import Icon from '../Icon';
import './style/index.scss';
interface ConfirmProps {
  type: 'info' | 'warn' | 'error';
  title?: string;
  show: boolean;
  children?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
}

const iconTypeMap = {
  info: {
    name: 'information-fill',
    color: 'var(--confirm-info-color)',
  },
  warn: {
    name: 'alert-fill',
    color: 'var(--confirm-warn-color)',
  },
  error: {
    name: 'close-circle-fill',
    color: 'var(--confirm-error-color)',
  },
};
const Confirm: FC<ConfirmProps> = (props) => {
  const { show, type, title, children, cancelText, confirmText, onCancel, onConfirm } = props;
  return (
    <Popup show={show} placement="center">
      <div className="cy-confirm">
        <h3 className="cy-confirm__header">
          <Icon name={iconTypeMap[type].name} size="22px" color={iconTypeMap[type].color} />
          <span className="cy-confirm__title">{title}</span>
        </h3>
        <div className="cy-confirm__content">{children}</div>
        <div className="cy-confirm__footer">
          <Button onClick={onCancel}>{cancelText || '取消'}</Button>
          <Button type="primary" onClick={onConfirm}>
            {confirmText || '确定'}
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default Confirm;
