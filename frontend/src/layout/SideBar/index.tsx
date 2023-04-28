import { FC, useEffect, useState } from 'react';
import { useToggle } from 'react-use';
import Icon from '@/components/Icon';
import ChatItem from './components/ChatItem';
import Tooltip from '@/components/Tooltip';
import RadioTabs from '@/components/RadioTabs';
import classnames from 'classnames/bind';
import { useLayoutStore } from '@/store/layout';
import { themeChangeTabs } from '@/config/config';
import { useThemeStore } from '@/store/theme';
import { useHotkeys } from 'react-hotkeys-hook';
import { HotkeysEvent } from 'react-hotkeys-hook/dist/types';
import { getAvatarUrl } from '@/utils/chat';
import { isMac } from '@/utils/utils';
import { useChatSessionStore } from '@/store/chat';
import logo from '@/assets/icons/logo.png';
import style from './style/index.module.scss';
import { chatSessionDB } from '@/db';
import { ChatSession } from '@/types/db';

const cn = classnames.bind(style);
const SideBar: FC = () => {
  const { collapse, toggleCollapse } = useLayoutStore((state) => state);
  const { theme, setTheme } = useThemeStore((state) => state);
  const { setSession } = useChatSessionStore((state) => state);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const { chatList } = useChatSessionStore((state) => state);

  useHotkeys(['ctrl+b', 'meta+b'], (event: KeyboardEvent, handler: HotkeysEvent) => {
    event.preventDefault();
    if (isMac() && handler.meta) {
      toggleCollapse();
    } else if (!isMac() && handler.ctrl) {
      toggleCollapse();
    }
  });

  const setCurrentSessionIdHandler = (id: string) => {
    setCurrentSessionId(id);
    changToCurrentSession(id);
    localStorage.setItem('currentSessionId', id);
  };

  // 切换到当前会话
  const changToCurrentSession = async (sessionId: string) => {
    try {
      const chatSessions = await chatSessionDB.queryAll();
      const session = chatSessions.find((item) => item.chatId === sessionId);
      session && setSession(session as ChatSession);
    } catch (error) {
      console.error(error);
    }
  };

  const getChatList = async () => {
    const id = localStorage.getItem('currentSessionId');
    if (id) {
      setCurrentSessionId(id);
      changToCurrentSession(id);
    } else {
      setCurrentSessionIdHandler(chatList[0]?.chatId || '');
    }
  };
  // 监听列表变化
  useEffect(() => {
    getChatList();
  }, [chatList]);

  return (
    <div className={cn('sidebar', 'flex flex-col pb-[16px]', { collapse })}>
      <div className={cn('sidebar__title')}>
        <div className={cn('sidebar__logo')}>
          <img src={logo} alt="logo" />
          <span className="text-[16px] ml-1 leading-[32px]">ChatY</span>
        </div>
        <Icon name={`${collapse ? 'layout-left-line' : 'layout-right-line'}`} size="18px" onClick={toggleCollapse} />
      </div>
      <div className={cn('sidebar__list')}>
        {chatList.map((item) => (
          <Tooltip key={item.chatId} text={item.name} align="right" open={collapse}>
            <ChatItem
              id={item.id}
              chatId={item.chatId}
              text={item.name}
              prefix={getAvatarUrl(item.avatarName)}
              checked={item.chatId === currentSessionId}
              collapse={collapse}
              onClick={() => setCurrentSessionIdHandler(item.chatId)}
            />
          </Tooltip>
        ))}
      </div>
      <RadioTabs
        options={themeChangeTabs}
        activeKey={theme}
        className={cn('sidebar__theme', `${collapse ? 'hidden' : ''}`)}
        tabChange={setTheme}
      />
    </div>
  );
};

export default SideBar;
