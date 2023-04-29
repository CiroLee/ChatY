import { FC, useEffect } from 'react';
import classNames from 'classnames';
import TitleBar from '../components/TitleBar';
import RoleModal from './components/RoleModal';
import SettingModal from './components/SettingModal';
import SideBar from './SideBar';
import Content from './Content';
import { useThemeStore } from '@/store/theme';
import { useMedia } from 'react-use';
import { useModalStore } from '@/store/modal';
import { chatSessionDB } from '@/db';
import { ChatSession } from '@/types/db';
import { useChatSessionStore } from '@/store/chat';
import HelpModal from './components/HelpModal';
import { isMac } from '@/utils/utils';
const App: FC = () => {
  const {
    roleAction,
    roleModalInfo,
    showRoleModal,
    showSettingModal,
    showHelpModal,
    toggleRoleModal,
    toggleSettingModal,
    toggleHelpModal,
    setRoleModalInfo,
  } = useModalStore((state) => state);
  const { setChatList } = useChatSessionStore((state) => state);
  const { theme, setTheme } = useThemeStore((state) => state);
  const isDark = useMedia('(prefers-color-scheme: dark)');
  const themeStr = isDark ? 'dark' : 'light';
  // 监听系统主题和本地主题设置，自动更新
  useEffect(() => {
    if (theme === 'auto') {
      setTheme('auto');
    } else {
      themeStr === theme && setTheme(themeStr);
    }
  }, [isDark]);
  const getAllChatList = async () => {
    try {
      const list = await chatSessionDB.queryAll();
      setChatList(list as ChatSession[]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoleModalClose = () => {
    setRoleModalInfo({
      id: 0,
      name: '',
      avatarName: '',
      description: '',
    });
    toggleRoleModal(false);
  };

  useEffect(() => {
    getAllChatList();
  }, []);

  return (
    <div className={classNames('flex flex-col h-[100vh] overflow-hidden', { 'rounded-[10px]': isMac() })}>
      <TitleBar />
      <div className="flex relative flex-1">
        <SideBar />
        <Content />
      </div>
      <RoleModal action={roleAction} show={showRoleModal} {...roleModalInfo} onCancel={handleRoleModalClose} />
      <SettingModal show={showSettingModal} onCancel={() => toggleSettingModal(false)} />
      <HelpModal show={showHelpModal} onCancel={() => toggleHelpModal(false)} />
    </div>
  );
};

export default App;
