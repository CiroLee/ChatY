import { FC, useState, useEffect, useRef, useLayoutEffect } from 'react';
import Whether from '../Whether';
import Icon from '../Icon';
import classNames from 'classnames';
import './style/index.scss';

interface TabItem {
  label?: string;
  value: string;
  icon?: string;
}
interface RadioTabsProps {
  options: TabItem[];
  className?: string;
  activeKey?: string;
  tabChange?: (value: string) => void;
}
const RadioTabs: FC<RadioTabsProps> = (props) => {
  const { options = [], activeKey = '', className } = props;
  const [active, setActive] = useState(activeKey);
  const ref = useRef<HTMLDivElement>(null);
  const activeBarRef = useRef<HTMLDivElement>(null);

  const calcActivePos = () => {
    const list = ref.current?.children || [];
    const activeOne = Array.from(list).find((item) => item.classList.contains('active')) as HTMLElement;
    if (activeOne && activeBarRef.current) {
      activeBarRef.current.style.transform = `translateX(${activeOne.offsetLeft - 4}px)`;
    }
  };
  const initActiveBarStyle = () => {
    if (ref.current && activeBarRef.current) {
      // 减去padding-x
      const width = ref.current.getBoundingClientRect().width - 8;
      console.log('width', width);

      activeBarRef.current.style.width = `${width / options.length}px`;
    }
  };
  useEffect(() => {
    if (active) {
      calcActivePos();
    }
  }, [active]);

  useLayoutEffect(() => {
    initActiveBarStyle();
  }, []);

  return (
    <div className={classNames('radio-tabs', className)} ref={ref}>
      {options.map((item) => (
        <li
          className={classNames('radio-tabs__item', { active: active === item.value })}
          key={item.value}
          onClick={() => setActive(item.value)}>
          <Whether condition={!!item.icon}>
            <Icon name={item.icon} />
          </Whether>
          <Whether condition={!!item.label}>
            <span className="radio-tabs__item-label">{item.label}</span>
          </Whether>
        </li>
      ))}
      <div ref={activeBarRef} className={'radio-tabs__active-bar'}></div>
    </div>
  );
};

export default RadioTabs;
