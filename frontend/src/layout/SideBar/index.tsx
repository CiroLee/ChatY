import { FC } from 'react';
import { useToggle } from 'react-use';
import Icon from '@/components/Icon';
import ChatItem from './components/ChatItem';
import Tooltip from '@/components/Tooltip';
import RadioTabs from '@/components/RadioTabs';
import classnames from 'classnames/bind';
import logo from '@/assets/icons/logo.png';
import style from './style/index.module.scss';
const cn = classnames.bind(style);
const themeChangeTabs = [
  {
    value: 'auto',
    icon: 'contrast-line',
  },
  {
    value: 'light',
    icon: 'sun-line',
  },
  {
    value: 'dark',
    icon: 'moon-line',
  },
];
const SideBar: FC = () => {
  const [collapse, toggleSidebar] = useToggle(false);
  const [collapseList, toggleList] = useToggle(false);
  return (
    <div className={cn('sidebar', 'flex flex-col pb-[16px]', { collapse })}>
      <div className={cn('sidebar__title')}>
        <div className={cn('sidebar__logo')}>
          <img src={logo} alt="logo" />
          <span className="text-[16px] ml-1 leading-[32px]">ChatY</span>
        </div>
        <Icon name={`${collapse ? 'layout-left-line' : 'layout-right-line'}`} size="18px" onClick={toggleSidebar} />
      </div>
      <div className={cn('flex mt-[12px]', `${collapse ? 'justify-center' : 'justify-end'}`)}>
        <Icon name={collapseList ? 'contract-up-down-line' : 'expand-up-down-line'} size="18px" onClick={toggleList} />
      </div>
      <ol className={cn('sidebar__list', 'flex-1', `${collapseList ? 'hidden' : 'block'}`)}>
        <Tooltip text="翻译狗" align="right" open={collapse}>
          <ChatItem id="chat1" text="翻译狗" prefix="#c0d293" collapse={collapse} />
        </Tooltip>
        <Tooltip text="chat2" align="right" open={collapse}>
          <ChatItem id="chat2" text="chat2" collapse={collapse} />
        </Tooltip>
      </ol>
      <RadioTabs options={themeChangeTabs} activeKey="auto" className={`${collapse ? 'hidden' : ''}`} />
    </div>
  );
};

export default SideBar;
