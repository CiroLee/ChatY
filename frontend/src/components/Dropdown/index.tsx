import { FC, useRef, useState, useEffect } from 'react';
import './style/index.scss';
import Icon from '../Icon';
import Whether from '../Whether';

export interface DropdownItem {
  key: string;
  label: string;
  icon?: string;
  color?: string;
}
interface DropdownProps {
  children: JSX.Element;
  items: DropdownItem[];
  itemOnClick: (id: string) => void;
}

const gap = 10;
const itemWidth = 124;
const Dropdown: FC<DropdownProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  const openDropdown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const targetType = (event.target as HTMLElement).parentElement?.dataset.type;
    if (ref.current && targetType !== 'dropdown') {
      const { x, y, height, width } = ref.current.getBoundingClientRect();
      setPos({ x: x - itemWidth + width, y: y + height + gap });
      setShow(true);
    }
  };

  const itemOnClickHandler = (key: string) => {
    setShow(false);
    props.itemOnClick(key);
  };

  useEffect(() => {
    document.addEventListener('click', (event: Event) => {
      const isChild = ref.current?.contains(event.target as Node);
      if (!isChild) {
        setShow(false);
      }
    });
    return () => {
      ref.current?.removeEventListener('click', () => undefined);
    };
  }, []);

  return (
    <div ref={ref} onClick={(event) => openDropdown(event)}>
      {props.children}
      <div
        data-type="dropdown"
        className="cy-dropdown"
        style={{ top: `${pos.y}px`, left: `${pos.x}px`, display: show ? 'block' : 'none' }}>
        {props.items.map((item) => (
          <li
            data-type="dropdown"
            key={item.key}
            style={{ color: item.color || 'inherit' }}
            onClick={() => itemOnClickHandler(item.key)}>
            <Whether condition={!!item.icon}>
              <Icon name={item.icon} color={item.color} />
            </Whether>
            <span>{item.label}</span>
          </li>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
