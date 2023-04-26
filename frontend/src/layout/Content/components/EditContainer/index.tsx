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
import { ChatItem } from '@/types/db';
import { saveSessionDB } from '@/utils/chat';
const cn = classNames.bind(style);
interface EditContainerProps {
  className?: string;
}
const EditContainer: FC<EditContainerProps> = (props) => {
  const { className } = props;
  const [max, toggleMax] = useToggle(false);
  const [height, setHeight] = useState(0);
  const [focus, setFocus] = useState(false);
  const [abortController, setAbortController] = useState<AbortController>();
  const { chatStatus, session, chatList, setChatList, addQuestion, setSession, updateAnswerStream } =
    useChatSessionStore((state) => state);

  const questionHandler = (content: string, push = true) => {
    // 添加到store的会话列表中
    push &&
      addQuestion({
        id: nanoId(16),
        role: 'user',
        content: `${content}`,
        createAt: timestamp(),
      });
    // TODO 发起请求时，根据配置，选择是否携带历史记录
    getChatCompletionStream(
      {
        messages: [
          {
            role: 'assistant',
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
  };
  const ref = useHotkeys(
    ['enter', 'meta+j', 'ctrl+j'],
    (event: KeyboardEvent, handler: HotkeysEvent) => {
      event.preventDefault();
      if (event.key.toLowerCase() === 'enter') {
        const content = (event.target as HTMLDivElement).innerText.replace(/(\r|\r\n|↵)/g, '\n');
        if (!content) return;
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

  // 底部按钮事件
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
  // 再次回答
  const reAnswer = () => {
    if (isAnyTrue([chatStatus !== 'idle' && chatStatus !== 'done', !session.list.length])) return;
    const lastQuestion = session.list.findLast((item) => item.role === 'user') as ChatItem;
    // 最后一个元素可能不是回答，例如中途取消回答，最后一个元素还是question
    const lastItem = session.list[session.list.length - 1];
    // 如果最后一个元素为回答(assistant, 则从列表中删掉)
    if (lastItem.role === 'assistant') {
      // 同步修改session中的list和chatList中对应条目的list
      const newChatList = chatList.map((item) => {
        if (item.chatId === session.chatId) {
          return {
            ...item,
            list: item.list.filter((item) => item.id !== lastItem.id),
          };
        }
        return item;
      });
      setChatList(newChatList);
      chatSessionDB.update(session.id, { list: session.list.filter((item) => item.id !== lastItem.id) });
    }
    questionHandler(lastQuestion.content, lastItem.role === 'assistant');
  };

  // 停止回答 停止回答不会触发sse的 onclose，所以这里要主动保存一下
  const stopAnswer = () => {
    if (abortController) {
      abortController?.abort();
      saveSessionDB();
    }
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
                className={cn('top-[1px]', {
                  'cursor-not-allowed opacity-60': isAllTrue([chatStatus !== 'outputting', chatStatus !== 'fetching']),
                })}
              />
            </div>
          </Tooltip>
          <Tooltip text="重新回答" align="topRight">
            <div className={cn('w-[20px] h-[20px] flex items-center justify-center')} onClick={reAnswer}>
              <Icon
                name="refresh-line"
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
