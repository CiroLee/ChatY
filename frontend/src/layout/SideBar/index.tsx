import { FC } from 'react';
import { useToggle } from 'react-use';
import Icon from '@/components/Icon';
import ChatItem from './components/ChatItem';
import Tooltip from '@/components/Tooltip';
import RadioTabs from '@/components/RadioTabs';
import classnames from 'classnames/bind';
import { useLayoutStore } from '@/store/layout';
import logo from '@/assets/icons/logo.png';
import style from './style/index.module.scss';
import { themeChangeTabs } from '@/config/config';
import { useThemeStore } from '@/store/theme';
const cn = classnames.bind(style);

const SideBar: FC = () => {
  const { collapse, toggleCollapse } = useLayoutStore((state) => state);
  const { theme, setTheme } = useThemeStore((state) => state);
  const [collapseList, toggleList] = useToggle(false);

  const handleThemeChange = (theme: string) => {
    // console.log('theme is: ', theme);
    setTheme(theme);
  };

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
        <Tooltip text="翻译狗" align="right" open={collapse}>
          <ChatItem id="chat1" text="翻译狗" prefix="#c0d293" collapse={collapse} />
        </Tooltip>
        <Tooltip text="chat2" align="right" open={collapse}>
          <ChatItem id="chat2" text="chat2" prefix="#c0d293" collapse={collapse} />
        </Tooltip>
      </ol>
      <RadioTabs
        options={themeChangeTabs}
        activeKey={theme}
        className={cn('sidebar__theme', `${collapse ? 'hidden' : ''}`)}
        tabChange={handleThemeChange}
      />
    </div>
  );
};

export default SideBar;
