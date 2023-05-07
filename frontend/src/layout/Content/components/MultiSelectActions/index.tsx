import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
import Icon from '@/components/Icon';
const cn = classNames.bind(style);

interface MultiSelectActionsProps {
  onClose: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  disabled?: boolean;
}
const MultiSelectActions: FC<MultiSelectActionsProps> = (props) => {
  const { onClose, disabled, onDelete, onExport } = props;
  const { t } = useTranslation();
  return (
    <div className={cn('multi-select-actions')}>
      <div className={cn('multi-select-actions__item', { disabled })} onClick={onExport}>
        <Icon name="save-2-line" size="18px" />
        <span className="ml-1 text-[13px]">{t('tooltip.export')}</span>
      </div>
      <div className={cn('multi-select-actions__item', { disabled })} onClick={onDelete}>
        <Icon name="delete-bin-line" size="18px" />
        <span className="ml-1 text-[13px]">{t('dropdown.delete')}</span>
      </div>
      <Icon name="close-line" size="24px" onClick={onClose} />
    </div>
  );
};

export default MultiSelectActions;
