import { FC, useRef, useState, useEffect } from 'react';
import './style/index.scss';
import Icon from '../Icon';
import Whether from '../Whether';

// TODO: accept hover trigger
interface DropdownItem {
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

  const openDropdown = () => {
    if (ref.current) {
      const { x, y, height, width } = ref.current.getBoundingClientRect();
      setPos({ x: x - itemWidth + width, y: y + height + gap });
      setShow(true);
    }
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
    <div ref={ref} onClick={openDropdown}>
      {props.children}
      <div className="dropdown" style={{ top: `${pos.y}px`, left: `${pos.x}px`, display: show ? 'block' : 'none' }}>
        {props.items.map((item) => (
          <li key={item.key} style={{ color: item.color || 'inherit' }} onClick={() => props.itemOnClick(item.key)}>
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
