import { FC } from 'react';
import { useToggle } from 'react-use';
import Icon from '@/components/Icon';
import ChatItem from './components/ChatItem';
import classnames from 'classnames/bind';
import logo from '@/assets/icons/logo.png';
import style from './style/index.module.scss';
const cn = classnames.bind(style);
const SideBar: FC = () => {
  const [collapse, toggleSidebar] = useToggle(false);
  const [collapseList, toggleList] = useToggle(false);
  return (
    <div className={cn('sidebar', { collapse })}>
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
      <ol className={cn('sidebar__list', `${collapseList ? 'hidden' : 'block'}`)}>
        <ChatItem id="chat1" text="翻译狗" prefix="#c0d293" collapse={collapse} />
        <ChatItem id="chat2" text="chat2" collapse={collapse} />
      </ol>
    </div>
  );
};

export default SideBar;
