import { FC, useState } from 'react';
import classnames from 'classnames/bind';
import style from './index.module.scss';
const cn = classnames.bind(style);
const SideBar: FC = () => {
  const [collapse, setCollapse] = useState(false);
  return <div className={cn('sidebar', { collapse })}>sidebar</div>;
};

export default SideBar;
