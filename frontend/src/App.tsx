import { FC, useEffect } from 'react';
import TitleBar from './components/TitleBar';
import SideBar from './layout/SideBar';
import Content from './layout/Content';
import { useLayoutStore } from '@/store/layout';
import { useThemeStore } from '@/store/theme';
import { useMedia } from 'react-use';
const App: FC = () => {
  const { toggleCollapse } = useLayoutStore((state) => state);
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
    console.log('theme change');
  }, [isDark]);
  return (
    <div className=" flex flex-col h-[100vh] overflow-hidden rounded-[10px]">
      <TitleBar />
      <div className="flex relative flex-1">
        <SideBar />
        <Content />
      </div>
    </div>
  );
};

export default App;
