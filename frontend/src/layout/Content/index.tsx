import { FC, useEffect, useRef } from 'react';
import Icon from '@/components/Icon';
import EditContainer from './components/EditContainer';
import { Question, Answer } from './components/QA';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
import { useLayoutStore } from '@/store/layout';
import { useModalStore } from '@/store/modal';
import { useChatSessionStore } from '@/store/chat';
import { getAvatarUrl } from '@/utils/chat';
import AvatarDefault from '@/assets/avatars/avatar-default.png';
const cn = classNames.bind(style);
const Content: FC = () => {
  const contentListRef = useRef<HTMLDivElement>(null);
  const { titleBarHeight } = useLayoutStore((state) => state);
  const { session } = useChatSessionStore((state) => state);
  const { toggleRoleModal, setRoleAction, toggleSettingModal } = useModalStore((state) => state);
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
        <div className="flex items-center h-full">
          <Icon name="add-line" size="18px" onClick={createRole} />
          <Icon name="settings-3-line" size="18px" className="ml-[12px]" onClick={() => toggleSettingModal(true)} />
        </div>
      </div>
      <div ref={contentListRef} className={cn('content-list')}>
        {session.list.map((item) =>
          item.role === 'user' ? (
            <Question avatar={AvatarDefault} className="mr-[16px] mb-[16px]" key={item.id} content={item.content} />
          ) : (
            <Answer
              className="ml-[16px] mb-[16px]"
              key={item.id}
              avatar={getAvatarUrl(session.avatarName)}
              content={item.content}
            />
          ),
        )}
      </div>
      <div className={cn('editor-input')}>
        <EditContainer />
      </div>
    </div>
  );
};

export default Content;
