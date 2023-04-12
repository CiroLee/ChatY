import { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import './style/index.scss';
interface TooltipProps {
  text: string;
  align: 'left' | 'right' | 'top' | 'bottom';
  open?: boolean;
  children: React.ReactNode;
}
const xGap = 16;
const yGap = 12;
const Tooltip: FC<TooltipProps> = (props) => {
  const { children, align, text, open = true } = props;
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && open) {
      ref.current.addEventListener('mouseenter', () => {
        setShow(true);
        updatePosition();
      });
      ref.current.addEventListener('mouseleave', () => {
        setShow(false);
      });
    }
    return () => {
      ref.current?.removeEventListener('mouseenter', () => undefined);
      ref.current?.removeEventListener('mouseleave', () => undefined);
    };
  }, [open, align]);

  const updatePosition = () => {
    if (!ref.current) return;
    if (align === 'right') {
      const { x, y, width } = ref.current.getBoundingClientRect();
      setPos({ x: x + width + xGap / 1.2, y });
    } else if (align === 'left') {
      const bounding = contentRef.current?.getBoundingClientRect();
      const contentWidth = bounding?.width || 0;
      const { x, y, width } = ref.current.getBoundingClientRect();
      setPos({ x: x - width - contentWidth, y: y - yGap });
    } else if (align === 'top') {
      const { y, height } = ref.current.getBoundingClientRect();
      setPos({ x: 0, y: y - height - yGap * 1.5 });
    } else if (align === 'bottom') {
      const { x, y, height, width } = ref.current.getBoundingClientRect();
      const bounding = contentRef.current?.getBoundingClientRect();
      setPos({ x: x - width / 2.5, y: y + height + yGap });
    }
  };

  return (
    <div ref={ref} className="tooltip">
      {children}
      <div
        ref={contentRef}
        className={classNames('tooltip__content', align)}
        style={{ top: `${pos.y}px`, left: `${pos.x}px`, display: show && open ? 'block' : 'none' }}>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default Tooltip;
