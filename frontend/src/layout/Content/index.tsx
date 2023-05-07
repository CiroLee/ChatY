import { FC, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/Icon';
import EditContainer from './components/EditContainer';
import SimpleShortcuts from './components/SimpleShortcuts';
import { Question, Answer } from './components/QA';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
import { useLayoutStore } from '@/store/layout';
import { useModalStore } from '@/store/modal';
import { useChatSessionStore } from '@/store/chat';
import { exportChatUtil, getAvatarUrl } from '@/utils/chat';
import AvatarDefault from '@/assets/avatars/avatar-default.png';
import Whether from '@/components/Whether';
import { useHotkeys } from 'react-hotkeys-hook';
import { HotkeysEvent } from 'react-hotkeys-hook/dist/types';
import { isMac } from '@/utils/utils';
import { useSettingStore } from '@/store/setting';
import MultiSelectActions from './components/MultiSelectActions';
import { ChatItem } from '@/types/db';
import { chatSessionDB } from '@/db';
import { isAnyTrue, omit } from 'fe-gear';
import Confirm from '@/components/Confirm';
const cn = classNames.bind(style);
const Content: FC = () => {
  const contentListRef = useRef<HTMLDivElement>(null);
  const { titleBarHeight } = useLayoutStore((state) => state);
  const { session, chatStatus, setSession } = useChatSessionStore((state) => state);
  const { showHelpModal, showSettingModal, toggleRoleModal, setRoleAction, toggleSettingModal, toggleHelpModal } =
    useModalStore((state) => state);
  const { showToken, currentSessionId } = useSettingStore((state) => state);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedChatList, setSelectedChatList] = useState<ChatItem[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();
  useHotkeys(['ctrl+n', 'meta+n'], (event: KeyboardEvent, handler: HotkeysEvent) => {
    event.preventDefault();
    if (isMac() && handler.meta) {
      createRole();
    } else if (!isMac() && handler.ctrl) {
      createRole();
    }
  });

  useHotkeys(['ctrl+x', 'meta+x'], (event: KeyboardEvent, handler: HotkeysEvent) => {
    event.preventDefault();
    if (isMac() && handler.meta) {
      toggleSettingModal(!showSettingModal);
    } else if (!isMac() && handler.ctrl) {
      toggleSettingModal(!showSettingModal);
    }
  });

  useHotkeys(['ctrl+h', 'meta+h'], (event: KeyboardEvent, handler: HotkeysEvent) => {
    event.preventDefault();
    if (isMac() && handler.meta) {
      toggleHelpModal(!showHelpModal);
    } else if (!isMac() && handler.ctrl) {
      toggleHelpModal(!showHelpModal);
    }
  });
  const createRole = () => {
    toggleRoleModal(true);
    setRoleAction('create');
  };
  const scrollToBottom = () => {
    const contentList = contentListRef.current;
    if (contentList) {
      contentList.scrollTo({
        top: contentList.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const chatStatusText = (status: string) => {
    switch (status) {
      case 'fetching':
        return t('chat.thinking');
      case 'outputting':
        return t('chat.outputting');
    }
  };

  const multiSelectChatChange = (checked: boolean, item: ChatItem) => {
    if (checked) {
      setSelectedChatList([...selectedChatList, item]);
    } else {
      const list = selectedChatList.filter((chat) => chat.id !== item.id);
      setSelectedChatList(list);
    }
  };

  const handleOpenMultiSelectActions = () => {
    if (isAnyTrue([chatStatus !== 'done' && chatStatus !== 'idle', !session.list.length])) return;
    setMultiSelectMode(true);
  };

  const closeMultiSelectActions = () => {
    setSelectedChatList([]);
    setMultiSelectMode(false);
  };

  // 删除选中的对话
  const bulkDeleteChats = async () => {
    try {
      const list = session.list.filter((item) => !selectedChatList.find((chat) => chat.id === item.id));
      await chatSessionDB.update(session.id, omit({ ...session, list }, ['id']));
      setSession({ ...session, list });
      closeMultiSelectActions();
      setShowConfirm(false);
    } catch (error) {
      console.error(error);
    }
  };

  // 导出选中的对话
  const bulkExportChats = () => {
    if (!selectedChatList.length) return;
    const sortedList = selectedChatList.sort((a, b) => {
      if (a.createAt !== b.createAt) {
        return a.createAt - b.createAt;
      }
      return a.role === 'user' ? -1 : 1;
    });

    exportChatUtil(sortedList, session.name, closeMultiSelectActions);
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    // 多选模式时，因为dom结构变化，scrollHeight可能会有变化，导致滚动到底
    // 因此多选触发时，不触发滚动
    if (!multiSelectMode) {
      scrollToBottom();
    }
  }, [session.list.length, contentListRef.current?.scrollHeight]);

  useEffect(() => {
    if (multiSelectMode) {
      closeMultiSelectActions();
    }
  }, [currentSessionId]);

  return (
    <div className={cn('content')} style={{ '--header-height': `${titleBarHeight}px` } as React.CSSProperties}>
      <div className={cn('session-header')}>
        <h3 className="text-[16px]">{session.name}</h3>
        <div>{chatStatusText(chatStatus)}</div>
        <div className="flex items-center h-full">
          <Icon name="add-line" size="18px" onClick={createRole} />
          <Icon name="settings-3-line" size="18px" className="ml-[12px]" onClick={() => toggleSettingModal(true)} />
          <Icon name="question-line" size="18px" className="ml-[12px]" onClick={() => toggleHelpModal(true)} />
        </div>
      </div>
      <Whether condition={!!session.chatId}>
        <div ref={contentListRef} className={cn('content-list')}>
          {session.list.map((item) =>
            item.role === 'user' ? (
              <Question
                className={cn('mb-[16px]', `${multiSelectMode ? 'mr-[10px]' : 'mr-[16px]'}`)}
                id={session.id}
                itemId={item.id}
                avatar={AvatarDefault}
                key={item.id}
                showToken={showToken}
                selectMode={multiSelectMode}
                content={item.content}
                onChange={(checked) => multiSelectChatChange(checked, item)}
              />
            ) : (
              <Answer
                className="ml-[16px] mb-[16px]"
                id={session.id}
                itemId={item.id}
                key={item.id}
                showToken={showToken}
                selectMode={multiSelectMode}
                avatar={getAvatarUrl(session.avatarName)}
                content={item.content}
                onChange={(checked) => multiSelectChatChange(checked, item)}
              />
            ),
          )}
        </div>
        <div className={cn('editor-input')}>
          {multiSelectMode ? (
            <MultiSelectActions
              disabled={!selectedChatList.length}
              onClose={closeMultiSelectActions}
              onDelete={() => {
                if (selectedChatList.length) {
                  setShowConfirm(true);
                }
              }}
              onExport={bulkExportChats}
            />
          ) : (
            <EditContainer openMultiSelectActions={handleOpenMultiSelectActions} />
          )}
        </div>
      </Whether>
      <Whether condition={!session.chatId}>
        <SimpleShortcuts className={cn('content-list', 'pt-0')} />
      </Whether>
      <Confirm
        type="warn"
        title={t('modal.tips')}
        show={showConfirm}
        cancelText={t('global.cancel')}
        confirmText={t('global.confirm')}
        onCancel={() => setShowConfirm(false)}
        onConfirm={bulkDeleteChats}>
        {t('modal.warnBeforeDeleteChats')}
      </Confirm>
    </div>
  );
};

export default Content;
