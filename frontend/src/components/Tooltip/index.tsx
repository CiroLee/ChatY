import { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import './style/index.scss';
interface TooltipProps {
  text: string;
  offsetX?: number;
  offsetY?: number;
  align: 'left' | 'right' | 'top' | 'bottom' | 'topRight';
  open?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}
const xGap = 18;
const yGap = 20;
const Tooltip: FC<TooltipProps> = (props) => {
  const { children, align, text, open = true, disabled, offsetX = 0, offsetY = 0 } = props;
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && open && !disabled) {
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
    // TODO 优化定位
    if (align === 'right') {
      const { x, y, width, height } = ref.current.getBoundingClientRect();
      const bounding = contentRef.current?.getBoundingClientRect();
      setPos({
        x: x + width + xGap + offsetX,
        y: bounding ? y + Math.abs(height - bounding.height) / 2 + offsetY : y + offsetY,
      });
    } else if (align === 'left') {
      const bounding = contentRef.current?.getBoundingClientRect();
      const contentWidth = bounding?.width || 0;
      const { x, y, width } = ref.current.getBoundingClientRect();
      setPos({ x: x - width - contentWidth + offsetX, y: y - yGap + offsetY });
    } else if (align === 'top') {
      const { y, height, left } = ref.current.getBoundingClientRect();
      const bounding = contentRef.current?.getBoundingClientRect();
      setPos({
        x: left - (bounding?.width ? bounding?.width / 2 : 0) + xGap / 2 + offsetX,
        y: y - height - yGap + offsetY,
      });
    } else if (align === 'bottom') {
      const { y, height, left } = ref.current.getBoundingClientRect();
      const bounding = contentRef.current?.getBoundingClientRect();
      setPos({
        x: left - (bounding?.width ? bounding?.width / 2 : 0) + xGap / 2 + offsetX,
        y: y + height + yGap + offsetY,
      });
    } else if (align === 'topRight') {
      const { y, height, left } = ref.current.getBoundingClientRect();
      const bounding = contentRef.current?.getBoundingClientRect();
      setPos({
        x: left - (bounding?.width ? bounding?.width : 0) + xGap + offsetX,
        y: y - height - yGap + offsetY,
      });
    }
  };

  return (
    <div ref={ref} className="tooltip">
      {children}
      <div
        ref={contentRef}
        className={classNames('tooltip__content', align)}
        style={{ top: `${pos.y}px`, left: `${pos.x}px`, visibility: show && open ? 'visible' : 'hidden' }}>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default Tooltip;
