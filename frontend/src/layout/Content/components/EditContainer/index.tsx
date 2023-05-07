import { FC, useState, useEffect } from 'react';
import Message from '@/components/Message';
import Icon from '@/components/Icon';
import Tooltip from '@/components/Tooltip';
import ToolBtns from './ToolBtns';
import { useTranslation } from 'react-i18next';
import { useToggle } from 'react-use';
import { omit, isAllTrue, isAnyTrue } from 'fe-gear';
import { useSettingStore } from '@/store/setting';
import { useChatSessionStore } from '@/store/chat';
import { useHotkeys } from 'react-hotkeys-hook';
import classNames from 'classnames/bind';
import { getChatCompletionStream } from '@/api';
import { HotkeysEvent } from 'react-hotkeys-hook/dist/types';
import { isMac, nanoId, timestamp } from '@/utils/utils';
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
  const { t } = useTranslation();

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
          message.warn(t('message.secretKeyUnset'));
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
          <span className={cn('tip')}>
            [Enter] {t('hotkeys.enter')}，[Shift+Enter] {t('hotkeys.shiftEnter')}，[{isMac() ? '⌘' : 'Ctrl'} + J]{' '}
            {t('hotkeys.toggleInputMode')}
          </span>
        </div>
        <div className={cn('cy-editor-tip', { max })}>
          <ToolBtns
            chatStatus={chatStatus}
            list={session.list}
            onClearChatSession={clearChatSession}
            onStopAnswer={stopAnswer}
            onExportChats={exportChats}
          />
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
