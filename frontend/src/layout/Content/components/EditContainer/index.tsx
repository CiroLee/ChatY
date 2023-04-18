import { FC, useState } from 'react';
import { useToggle } from 'react-use';
import { useHotkeys } from 'react-hotkeys-hook';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
import { HotkeysEvent } from 'react-hotkeys-hook/dist/types';
const cn = classNames.bind(style);
interface EditContainerProps {
  className?: string;
}
const EditContainer: FC<EditContainerProps> = (props) => {
  const { className } = props;
  const [max, toggleMax] = useToggle(false);
  const [height, setHeight] = useState(0);
  const [focus, setFocus] = useState(false);
  const ref = useHotkeys(
    ['enter', 'shift+f'],
    (event: KeyboardEvent, handler: HotkeysEvent) => {
      event.preventDefault();
      toggleMaxInput(handler);
      let content = (event.target as HTMLDivElement).innerHTML.replaceAll('<br>', '\n');
      content = JSON.stringify(content);
      console.log('ENTER what-you-write is: ', content);
    },
    { enableOnContentEditable: true },
  );

  const toggleMaxInput = (handler: HotkeysEvent) => {
    if (handler?.keys?.[0] === 'f' && handler.shift) {
      toggleMaxHandler();
    }
  };

  const toggleMaxHandler = (max?: boolean) => {
    if (ref.current) {
      const { height } = ref.current.getBoundingClientRect();
      setHeight(height);
      if (typeof max === 'boolean') {
        toggleMax(max);
      } else {
        toggleMax();
      }
    }
  };

  const onBlurHandler = () => {
    toggleMaxHandler(false);
    setFocus(false);
  };

  return (
    <div className={cn('cy-editor-wrapper', { focus })}>
      <div
        ref={ref as React.LegacyRef<HTMLDivElement>}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setFocus(true)}
        onBlur={onBlurHandler}
        style={{ '--height': `${height}px` } as React.CSSProperties}
        className={cn('cy-editor', className, `${max ? 'in-max' : 'out-max'}`)}></div>
    </div>
  );
};

export default EditContainer;
