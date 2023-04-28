import { FC, useState, useEffect, useRef, useLayoutEffect } from 'react';
import Whether from '../Whether';
import Icon from '../Icon';
import classNames from 'classnames';
import './style/index.scss';

export interface TabItem {
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
  const { options = [], activeKey = '', className, tabChange } = props;
  const [active, setActive] = useState('');
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
      activeBarRef.current.style.width = `${width / options.length}px`;
    }
  };

  const tabChangeHandler = (value: string) => {
    setActive(value);
    tabChange?.(value);
  };
  useEffect(() => {
    if (active) {
      calcActivePos();
    }
  }, [active]);

  useLayoutEffect(() => {
    initActiveBarStyle();
  }, []);

  useEffect(() => {
    setActive(activeKey);
  }, [activeKey]);

  return (
    <div className={classNames('radio-tabs', className)} ref={ref}>
      {options.map((item) => (
        <li
          className={classNames('radio-tabs__item', { active: active === item.value })}
          key={item.value}
          onClick={() => tabChangeHandler(item.value)}>
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
