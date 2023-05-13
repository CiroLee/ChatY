import classNames from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import './style/index.scss';
interface TooltipProps {
  text: string;
  offsetX?: number;
  offsetY?: number;
  align: 'left' | 'right' | 'top' | 'bottom' | 'topRight' | 'bottomLeft';
  open?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}
const xGap = 18;
const yGap = 20;
const Tooltip: FC<TooltipProps> = (props) => {
  const { className, children, align, text, open = true, disabled, offsetX = 0, offsetY = 0 } = props;
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
    const { x, y, width, height, left } = ref.current.getBoundingClientRect();
    const bounding = contentRef.current?.getBoundingClientRect();
    const contentWidth = bounding?.width || 0;
    let posX = 0;
    let posY = 0;
    switch (align) {
      case 'left':
        posX = x - width - contentWidth + offsetX;
        posY = y - yGap + offsetY;
        break;
      case 'top':
        posX = left - (bounding?.width ? bounding?.width / 2 : 0) + xGap / 2 + offsetX;
        posY = y - height - yGap + offsetY;
        break;
      case 'right':
        posX = x + width + xGap + offsetX;
        posY = bounding ? y + Math.abs(height - bounding.height) / 2 + offsetY : y + offsetY;
        break;
      case 'bottom':
        posX = left - (bounding?.width ? bounding?.width / 2 : 0) + xGap / 2 + offsetX;
        posY = y + height + yGap + offsetY;
        break;
      case 'topRight':
        posX = left - (bounding?.width ? bounding?.width : 0) + xGap + offsetX;
        posY = y - height - yGap + offsetY;
        break;
      case 'bottomLeft':
        posX = left + xGap / 2 + offsetX;
        posY = y + height + yGap + offsetY;
        break;
      default:
        return;
    }
    setPos({ x: posX, y: posY });
  };

  return (
    <div ref={ref} className="tooltip">
      {children}
      <div
        ref={contentRef}
        className={classNames('tooltip__content', align, className)}
        style={{ top: `${pos.y}px`, left: `${pos.x}px`, visibility: show && open ? 'visible' : 'hidden' }}>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default Tooltip;
