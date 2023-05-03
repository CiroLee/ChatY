import { FC } from 'react';
import Popup from '../Popup';
import Button from '../Button';
import Icon from '../Icon';
import './style/index.scss';
interface ConfirmProps {
  type: 'info' | 'warn' | 'error';
  title?: string | null;
  show: boolean;
  children?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string | null;
  confirmText?: string | null;
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
          <Button onClick={onCancel}>{cancelText || 'cancel'}</Button>
          <Button type="primary" onClick={onConfirm}>
            {confirmText || 'confirm'}
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default Confirm;
