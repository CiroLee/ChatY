import { FC, useState } from 'react';
import classnames from 'classnames/bind';
import style from './index.module.scss';
const cn = classnames.bind(style);
const SideBar: FC = () => {
  const [collapse, setCollapse] = useState(false);
  return (
    <div className={cn('sidebar', { collapse })}>
      <div>
        <div className={cn('sidebar__title')}>
          <div className="flex item-center">
            <i className={cn('sidebar__title-icon')}></i>
            <span className="text-[18px] ml-2">ChatY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
