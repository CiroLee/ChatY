import { FC } from 'react';
import classNames from 'classnames/bind';
import Icon from '@/components/Icon';
import Tooltip from '@/components/Tooltip';
import { isAnyTrue, isAllTrue } from 'fe-gear';
import { useTranslation } from 'react-i18next';
import style from './style/index.module.scss';
import { ChatItem } from '@/types/db';
const cn = classNames.bind(style);

interface ToolBtnsProps {
  chatStatus: string;
  list: ChatItem[];
  onOpenMultiSelectActions: () => void;
  onClearChatSession: () => void;
  onStopAnswer: () => void;
  onExportChats: () => void;
}
const ToolBtns: FC<ToolBtnsProps> = (props) => {
  const { chatStatus, list, onClearChatSession, onStopAnswer, onExportChats, onOpenMultiSelectActions } = props;
  const { t } = useTranslation();
  return (
    <>
      <Tooltip text={t('tooltip.multipleSelect')} align="top" offsetY={-12}>
        <div
          className={cn('w-[20px] h-[20px] flex items-center justify-center mr-3')}
          onClick={onOpenMultiSelectActions}>
          <Icon
            name="checkbox-multiple-line"
            size="17px"
            className={cn({
              'cursor-not-allowed opacity-60': isAnyTrue([
                chatStatus !== 'done' && chatStatus !== 'idle',
                !list.length,
              ]),
            })}
          />
        </div>
      </Tooltip>
      <Tooltip text={t('tooltip.clearChat')} align="top" offsetY={-12}>
        <div className={cn('w-[20px] h-[20px] flex items-center justify-center mr-3')} onClick={onClearChatSession}>
          <Icon
            name="brush-3-line"
            size="17px"
            className={cn({
              'cursor-not-allowed opacity-60': isAnyTrue([
                chatStatus !== 'done' && chatStatus !== 'idle',
                !list.length,
              ]),
            })}
          />
        </div>
      </Tooltip>
      <Tooltip text={t('tooltip.stopAnswer')} align="top" offsetY={-12}>
        <div className={cn('w-[20px] h-[20px] flex items-center justify-center mr-3')} onClick={onStopAnswer}>
          <Icon
            name="stop-fill"
            size="24px"
            color="#f34747"
            className={cn({
              'cursor-not-allowed opacity-60': isAllTrue([chatStatus !== 'outputting', chatStatus !== 'fetching']),
            })}
          />
        </div>
      </Tooltip>
      <Tooltip text={t('tooltip.exportChat')} align="topRight" offsetY={-12}>
        <div className={cn('w-[20px] h-[20px] flex items-center justify-center')} onClick={onExportChats}>
          <Icon
            name="save-2-line"
            size="17px"
            className={cn({
              'cursor-not-allowed opacity-60': isAnyTrue([
                chatStatus !== 'idle' && chatStatus !== 'done',
                !list.length,
              ]),
            })}
          />
        </div>
      </Tooltip>
    </>
  );
};

export default ToolBtns;
