import { FC, useEffect, useRef } from 'react';
import Icon from '@/components/Icon';
import EditContainer from './components/EditContainer';
import SimpleShortcuts from './components/SimpleShortcuts';
import { Question, Answer } from './components/QA';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
import { useLayoutStore } from '@/store/layout';
import { useModalStore } from '@/store/modal';
import { useChatSessionStore } from '@/store/chat';
import { getAvatarUrl } from '@/utils/chat';
import AvatarDefault from '@/assets/avatars/avatar-default.png';
import Whether from '@/components/Whether';
import { useHotkeys } from 'react-hotkeys-hook';
import { HotkeysEvent } from 'react-hotkeys-hook/dist/types';
import { isMac } from '@/utils/utils';
import { useSettingStore } from '@/store/setting';
const cn = classNames.bind(style);
const Content: FC = () => {
  const contentListRef = useRef<HTMLDivElement>(null);
  const { titleBarHeight } = useLayoutStore((state) => state);
  const { session, chatStatus } = useChatSessionStore((state) => state);
  const { showHelpModal, showSettingModal, toggleRoleModal, setRoleAction, toggleSettingModal, toggleHelpModal } =
    useModalStore((state) => state);
  const { showToken } = useSettingStore((state) => state);

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
        return '思考中...';
      case 'outputting':
        return '输出中...';
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [session.list.length, contentListRef.current?.scrollHeight]);

  return (
    <div className={cn('content')} style={{ '--header-height': `${titleBarHeight}px` } as React.CSSProperties}>
      <div className={cn('session-header')}>
        <h3 className="text-[18px]">{session.name}</h3>
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
                className="mr-[16px] mb-[16px]"
                avatar={AvatarDefault}
                key={item.id}
                showToken={showToken}
                content={item.content}
              />
            ) : (
              <Answer
                className="ml-[16px] mb-[16px]"
                key={item.id}
                showToken={showToken}
                avatar={getAvatarUrl(session.avatarName)}
                content={item.content}
              />
            ),
          )}
        </div>
        <div className={cn('editor-input')}>
          <EditContainer />
        </div>
      </Whether>
      <Whether condition={!session.chatId}>
        <SimpleShortcuts className={cn('content-list', 'pt-0')} />
      </Whether>
    </div>
  );
};

export default Content;
