import { getChatCompletionStream } from '@/api';
import Confirm from '@/components/Confirm';
import Message from '@/components/Message';
import { chatSessionDB } from '@/db';
import { useChatSessionStore } from '@/store/chat';
import { useSettingStore } from '@/store/setting';
import { ChatMessage } from '@/types/openai';
import { exportChatUtil, saveSessionDB } from '@/utils/chat';
import { isMac, nanoId, timestamp } from '@/utils/utils';
import classNames from 'classnames/bind';
import { isAllTrue, isAnyTrue, omit } from 'fe-gear';
import { FC, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { HotkeysEvent } from 'react-hotkeys-hook/dist/types';
import { useTranslation } from 'react-i18next';
import { useToggle } from 'react-use';
import ToolBtns from './ToolBtns';
import style from './style/index.module.scss';
const cn = classNames.bind(style);
interface EditContainerProps {
  className?: string;
  openMultiSelectActions: () => void;
}
const EditContainer: FC<EditContainerProps> = (props) => {
  const { className, openMultiSelectActions } = props;
  const [max, toggleMax] = useToggle(false);
  const [height, setHeight] = useState(0);
  const [focus, setFocus] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>();
  const [showConfirm, setShowConfirm] = useState(false);
  const { apiKey, continuousChat } = useSettingStore((state) => state);
  const { chatStatus, session, addQuestion, setSession, changeChatStatus, updateAnswerStream } = useChatSessionStore(
    (state) => state,
  );
  const { t } = useTranslation();

  const message = new Message();

  const questionHandler = async (content: string, push = true) => {
    if (!isAllTrue([chatStatus === 'done' || chatStatus === 'idle', session.chatId])) return;
    let messages: ChatMessage[] = [];
    if (continuousChat) {
      const historyContents = session.list.map((item) => omit<ChatMessage>(item, ['id', 'createAt']));
      messages = [...historyContents, { role: 'user', content }];
    } else {
      messages = [{ role: 'user', content }];
    }

    // 添加到store的会话列表中
    push &&
      addQuestion({
        id: nanoId(16),
        role: 'user',
        content: `${content}`,
        createAt: timestamp(),
      });
    try {
      await getChatCompletionStream({ messages }, (data, controller) => {
        if (!abortController) {
          setAbortController(controller);
        }

        updateAnswerStream({
          id: data.id,
          role: 'assistant',
          content: data.content,
          createAt: timestamp(),
        });
      });
    } catch (error) {
      console.error(error);
      const msg = (error as Error)?.message.replace(/Error:/g, '').trim();
      if (msg) {
        message.error(t(msg));
      } else {
        message.error('Oops, something went wrong');
      }
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
      setShowConfirm(false);
    } catch (error) {
      console.error(error);
    }
  };

  // 停止回答 停止回答不会触发sse的 onclose，所以这里要主动保存一下
  const stopAnswer = () => {
    if (chatStatus !== 'outputting') return;
    if (abortController) {
      abortController?.abort();
      saveSessionDB();
      changeChatStatus('idle');
      setAbortController(null);
    }
  };

  const exportChats = () => {
    if (isAnyTrue([chatStatus !== 'idle' && chatStatus !== 'done', !session.list.length])) return;
    exportChatUtil(session.list, session.name);
  };

  // this effect no use ,just wanna see the change of chatStatus...
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
            onOpenMultiSelectActions={openMultiSelectActions}
            onClearChatSession={() => {
              if (session.list.length) {
                setShowConfirm(true);
              }
            }}
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
      <Confirm
        type="warn"
        title={t('modal.tips')}
        show={showConfirm}
        cancelText={t('global.cancel')}
        confirmText={t('global.confirm')}
        onCancel={() => setShowConfirm(false)}
        onConfirm={clearChatSession}>
        {t('modal.warnBeforeClearChat')}
      </Confirm>
    </div>
  );
};

export default EditContainer;
