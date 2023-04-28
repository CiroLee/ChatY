import { FC, useState, useEffect } from 'react';
import { useToggle } from 'react-use';
import { omit, isAllTrue, isAnyTrue } from 'fe-gear';
import { useSettingStore } from '@/store/setting';
import { useChatSessionStore } from '@/store/chat';
import { useHotkeys } from 'react-hotkeys-hook';
import classNames from 'classnames/bind';
import { getChatCompletionStream } from '@/api';
import { HotkeysEvent } from 'react-hotkeys-hook/dist/types';
import { isMac, nanoId, timestamp } from '@/utils/utils';
import Message from '@/components/Message';
import Icon from '@/components/Icon';
import Tooltip from '@/components/Tooltip';
import { chatSessionDB } from '@/db';
import { saveSessionDB } from '@/utils/chat';
import { SaveFile } from '@wails/go/app/App';
import style from './style/index.module.scss';
import { ChatMessage } from '@/types/openai';
const cn = classNames.bind(style);
interface EditContainerProps {
  className?: string;
}
const EditContainer: FC<EditContainerProps> = (props) => {
  const { className } = props;
  const [max, toggleMax] = useToggle(false);
  const [height, setHeight] = useState(0);
  const [focus, setFocus] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>();
  const { contextRange, apiKey } = useSettingStore((state) => state);
  const { chatStatus, session, addQuestion, setSession, changeChatStatus, updateAnswerStream } = useChatSessionStore(
    (state) => state,
  );

  const message = new Message();

  const questionHandler = async (content: string, push = true) => {
    if (!isAllTrue([chatStatus === 'done' || chatStatus === 'idle', session.chatId])) return;
    const num = Math.ceil((session.list.length * contextRange) / 100);
    const historyContents = session.list
      .filter((_, index) => index >= num)
      .map((item) => omit<ChatMessage>(item, ['id', 'createAt']));

    // 添加到store的会话列表中
    push &&
      addQuestion({
        id: nanoId(16),
        role: 'user',
        content: `${content}`,
        createAt: timestamp(),
      });
    try {
      await getChatCompletionStream(
        {
          messages: [
            ...historyContents,
            {
              role: 'user',
              content,
            },
          ],
        },
        (data, controller) => {
          if (!abortController) {
            setAbortController(controller);
          }

          updateAnswerStream({
            id: data.id,
            role: 'assistant',
            content: data.content,
            createAt: timestamp(),
          });
        },
      );
    } catch (error) {
      console.error(error);
      message.error((error as Error)?.message || 'Oops, something went wrong');
    }
  };
  const ref = useHotkeys(
    ['enter', 'meta+j', 'ctrl+j'],
    (event: KeyboardEvent, handler: HotkeysEvent) => {
      event.preventDefault();
      if (event.key.toLowerCase() === 'enter') {
        const content = (event.target as HTMLDivElement).innerText.replace(/(\r|\r\n)/g, '\n');
        if (!content.replaceAll(/(\r|\r\n|\n)/g, '')) return;
        if (!apiKey) {
          message.warn('还未设置apiKey，请先设置');
          return;
        }
        questionHandler(content);
        (event.target as HTMLDivElement).innerText = '';
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

  // 清除历史
  const clearChatSession = async () => {
    if (isAnyTrue([chatStatus !== 'done' && chatStatus !== 'idle', !session.list.length])) return;
    try {
      await chatSessionDB.update(session.id, omit({ ...session, list: [] }, ['id']));
      setSession({ ...session, list: [] });
    } catch (error) {
      console.error(error);
    }
  };

  // 停止回答 停止回答不会触发sse的 onclose，所以这里要主动保存一下
  const stopAnswer = () => {
    if (abortController) {
      abortController?.abort();
      saveSessionDB();
      changeChatStatus('idle');
      setAbortController(null);
    }
  };

  const exportChats = () => {
    if (isAnyTrue([chatStatus !== 'idle' && chatStatus !== 'done', !session.list.length])) return;
    let mdData = '';
    session.list.forEach((item) => {
      if (item.role === 'assistant') {
        mdData += `**${session.name}**:\n\n${item.content}\n\n`;
      } else {
        mdData += `**${item.role}**:\n\n${item.content}\n\n`;
      }
    });
    SaveFile(mdData).catch((err) => console.error(err));
  };

  useEffect(() => {
    console.log(chatStatus);
  }, [chatStatus]);

  return (
    <div>
      <div className="mb-2 px-[6px] flex justify-between">
        <div className={cn('cy-editor-tip', { max })}>
          <span className={cn('tip')}>Enter 发送，Shift+Enter 换行，{isMac() ? '⌘' : 'Ctrl'} + J 半屏/原始输入</span>
        </div>
        <div className={cn('cy-editor-tip', { max })}>
          <Tooltip text="清空记录" align="top">
            <div className={cn('w-[20px] h-[20px] flex items-center justify-center mr-3')} onClick={clearChatSession}>
              <Icon
                name="brush-3-line"
                size="15px"
                className={cn('relative', {
                  'cursor-not-allowed opacity-60': isAnyTrue([
                    chatStatus !== 'done' && chatStatus !== 'idle',
                    !session.list.length,
                  ]),
                })}
              />
            </div>
          </Tooltip>
          <Tooltip text="停止回答" align="top">
            <div className={cn('w-[20px] h-[20px] flex items-center justify-center mr-3')} onClick={stopAnswer}>
              <Icon
                name="stop-fill"
                size="22px"
                color="#f34747"
                className={cn({
                  'cursor-not-allowed opacity-60': isAllTrue([chatStatus !== 'outputting', chatStatus !== 'fetching']),
                })}
              />
            </div>
          </Tooltip>
          <Tooltip text="导出记录" align="topRight">
            <div className={cn('w-[20px] h-[20px] flex items-center justify-center')} onClick={exportChats}>
              <Icon
                name="save-2-line"
                size="16px"
                className={cn({
                  'cursor-not-allowed opacity-60': isAnyTrue([
                    chatStatus !== 'idle' && chatStatus !== 'done',
                    !session.list.length,
                  ]),
                })}
              />
            </div>
          </Tooltip>
        </div>
      </div>
      <div
        className={cn('cy-editor-wrapper', {
          focus,
          disabled: !isAllTrue([chatStatus === 'done' || chatStatus === 'idle', session.chatId]),
        })}>
        <div
          ref={ref as React.LegacyRef<HTMLDivElement>}
          contentEditable={isAllTrue([chatStatus === 'done' || chatStatus === 'idle', session.chatId])}
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
