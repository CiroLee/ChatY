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
import { isMac, omit } from '@/utils/utils';

import { chatSessionDB } from '@/db';
import logo from '@/assets/icons/logo.png';
import style from './style/index.module.scss';
import { ChatSession } from '@/types/db';
const cn = classnames.bind(style);

const mockSessions = [
  {
    id: '001',
    text: '翻译狗',
    prefix: 'avatar-idea',
  },
  {
    id: '002',
    text: '名字特别长的文字哈哈哈',
    prefix: 'avatar-code',
  },
];

const SideBar: FC = () => {
  const { collapse, toggleCollapse } = useLayoutStore((state) => state);
  const { theme, setTheme } = useThemeStore((state) => state);
  const [collapseList, toggleList] = useToggle(false);
  const [currentSession, setCurrentSession] = useState('001');
  const [chatList, setChatList] = useState<ChatSession[]>([]);

  useHotkeys(['ctrl+b', 'meta+b'], (event: KeyboardEvent, handler: HotkeysEvent) => {
    event.preventDefault();
    if (isMac() && handler.meta) {
      toggleCollapse();
    } else if (!isMac() && handler.ctrl) {
      toggleCollapse();
    }
  });

  const getChatList = async () => {
    try {
      const list = (await chatSessionDB.queryAll()).map((item) => omit<ChatSession>(item, ['list']));
      setChatList(list);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChatList();
    chatSessionDB.chats.hook('creating', (_, obj) => {
      console.log(obj);
    });
  }, []);

  return (
    <div className={cn('sidebar', 'flex flex-col pb-[16px]', { collapse })}>
      <div className={cn('sidebar__title')}>
        <div className={cn('sidebar__logo')}>
          <img src={logo} alt="logo" />
          <span className="text-[16px] ml-1 leading-[32px]">ChatY</span>
        </div>
        <Icon name={`${collapse ? 'layout-left-line' : 'layout-right-line'}`} size="18px" onClick={toggleCollapse} />
      </div>
      <div className={cn('flex mt-[12px]', `${collapse ? 'justify-center' : 'justify-end'}`)}>
        <Icon name={collapseList ? 'contract-up-down-line' : 'expand-up-down-line'} size="18px" onClick={toggleList} />
      </div>
      <ol className={cn('sidebar__list', 'flex-1', `${collapseList ? 'hidden' : 'block'}`)}>
        {chatList.map((session) => (
          <Tooltip key={session.chatId} text={session.name} align="right" open={collapse}>
            <ChatItem
              id={session.id}
              text={session.name}
              prefix={getAvatarUrl(session.avatarName)}
              checked={session.id === currentSession}
              collapse={collapse}
              onClick={() => setCurrentSession(session.id)}
            />
          </Tooltip>
        ))}
      </ol>
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
