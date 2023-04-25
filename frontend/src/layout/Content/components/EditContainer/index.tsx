import { FC, useState, useEffect } from 'react';
import { useToggle } from 'react-use';
import { omit, isAllTrue, isAnyTrue } from 'fe-gear';
import { useChatSessionStore } from '@/store/chat';
import { useHotkeys } from 'react-hotkeys-hook';
import classNames from 'classnames/bind';
import { getChatCompletionStream } from '@/api';
import { HotkeysEvent } from 'react-hotkeys-hook/dist/types';
import { isMac, nanoId, timestamp } from '@/utils/utils';
import style from './style/index.module.scss';
import Icon from '@/components/Icon';
import Tooltip from '@/components/Tooltip';
import { chatSessionDB } from '@/db';
const cn = classNames.bind(style);
interface EditContainerProps {
  className?: string;
}
const EditContainer: FC<EditContainerProps> = (props) => {
  const { className } = props;
  const [max, toggleMax] = useToggle(false);
  const [height, setHeight] = useState(0);
  const [focus, setFocus] = useState(false);
  const { chatStatus, session, addQuestion, setSession, updateAnswerStream } = useChatSessionStore((state) => state);

  const ref = useHotkeys(
    ['enter', 'meta+j', 'ctrl+j'],
    (event: KeyboardEvent, handler: HotkeysEvent) => {
      event.preventDefault();
      if (event.key.toLowerCase() === 'enter') {
        const content = (event.target as HTMLDivElement).innerText.replace(/(\r|\r\n|↵)/g, '\n');
        if (!content) return;

        // 添加到store的会话列表中
        addQuestion({
          id: nanoId(),
          role: 'user',
          content: `${content}`,
          createAt: timestamp(),
        });

        (event.target as HTMLDivElement).innerText = '';

        // TODO 发起请求时，根据配置，选择是否携带历史记录
        getChatCompletionStream(
          {
            messages: [
              {
                role: 'assistant',
                content,
              },
            ],
            maxTokens: 1024,
            temperature: 0.6,
          },
          (data) => {
            updateAnswerStream({
              id: data.id,
              role: 'assistant',
              content: data.content,
              createAt: timestamp(),
            });
          },
        );
      } else {
        toggleMaxInput(handler);
      }
    },
    { enableOnContentEditable: true },
  );

  const toggleMaxInput = (handler: HotkeysEvent) => {
    if (isMac() && handler?.keys?.[0] === 'j' && handler.meta) {
      toggleMaxHandler();
    } else if (!isMac() && handler?.keys?.[0] === 'j' && handler.ctrl) {
      toggleMaxHandler();
    }
  };

  const toggleMaxHandler = (max?: boolean) => {
    if (ref.current) {
      const { height } = ref.current.getBoundingClientRect();
      setHeight(height);
      if (typeof max === 'boolean') {
        toggleMax(max);
      } else {
        toggleMax();
      }
    }
  };

  const onBlurHandler = () => {
    toggleMaxHandler(false);
    setFocus(false);
  };

  const clearChatSession = async () => {
    if (isAnyTrue([chatStatus !== 'done' && chatStatus !== 'idle', !session.list.length])) return;
    try {
      await chatSessionDB.update(session.id, omit({ ...session, list: [] }, ['id']));
      setSession({ ...session, list: [] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mb-2 px-[6px] flex justify-between">
        <div className={cn('cy-editor-tip', { max })}>
          Enter 发送，Shift+Enter 换行，{isMac() ? '⌘' : 'Ctrl'} + J 半屏/原始输入
        </div>
        <div className="flex items-center">
          <Tooltip text="清空记录" align="top">
            <Icon
              name="brush-3-line"
              size="15px"
              className={cn('relative mr-3 top-[1px]', {
                'cursor-not-allowed opacity-60': isAnyTrue([
                  chatStatus !== 'done' && chatStatus !== 'idle',
                  !session.list.length,
                ]),
              })}
              onClick={clearChatSession}
            />
          </Tooltip>
          <Tooltip text="停止回答" align="top">
            <Icon
              name="stop-fill"
              size="22px"
              color="#f34747"
              className={cn('relative mr-3 top-[2px]', {
                'cursor-not-allowed opacity-60': isAnyTrue([chatStatus === 'done', chatStatus === 'idle']),
              })}
            />
          </Tooltip>
          <Tooltip text="重新回答" align="topRight">
            <Icon
              name="refresh-line"
              size="16px"
              className={cn('relative', {
                'cursor-not-allowed opacity-60': isAnyTrue([chatStatus !== 'done', chatStatus === 'idle']),
              })}
            />
          </Tooltip>
        </div>
      </div>
      <div
        className={cn('cy-editor-wrapper', {
          focus,
          disabled: isAllTrue([chatStatus !== 'done', chatStatus !== 'idle']),
        })}>
        <div
          ref={ref as React.LegacyRef<HTMLDivElement>}
          contentEditable={chatStatus === 'done' || chatStatus === 'idle'}
          suppressContentEditableWarning
          onFocus={() => setFocus(true)}
          onBlur={onBlurHandler}
          style={{ '--height': `${height}px` } as React.CSSProperties}
          className={cn('cy-editor', className, `${max ? 'in-max' : 'out-max'}`)}></div>
      </div>
    </div>
  );
};

export default EditContainer;
