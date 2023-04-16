import { FC, useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash-es';
import { useEvent } from 'react-use';
import Whether from '../Whether';
import Icon from '../Icon';
import classNames from 'classnames';
import './style/index.scss';
interface TextAreaProps {
  value: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  clearable?: boolean;
  autoHeight?: boolean;
  showCount?: boolean;
  onChange?: (value: string) => void;
}

const Textarea: FC<TextAreaProps> = (props) => {
  const { value, placeholder, className, maxLength, autoHeight, clearable, showCount, onChange } = props;
  const ref = useRef<HTMLTextAreaElement>(null);
  const [inputVal, setInputVal] = useState(value);
  const [countStr, setCountStr] = useState('');
  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLength && e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }
    setInputVal(e.target.value);
    onChange?.(e.target.value);
    autoRows();
    showCount && calcCountStr();
  };
  const autoRows = () => {
    if (!autoHeight) return;
    if (ref.current) {
      const { height } = ref.current.getBoundingClientRect();
      if (ref.current.scrollHeight !== height) {
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
    }
  };
  const clearInput = () => {
    if (ref.current) {
      const { height } = ref.current.getBoundingClientRect();
      ref.current.style.height = `${height}px`;
    }
    setInputVal('');
    onChange?.('');
    showCount && calcCountStr('0');
  };

  useEvent('resize', debounce(autoRows, 200), window);

  useEffect(() => {
    calcCountStr();
  }, [showCount]);

  const calcCountStr = (length?: string) => {
    if (maxLength) {
      setCountStr(`${length || inputVal.length}/${maxLength}`);
    } else {
      setCountStr(`${length || inputVal.length}`);
    }
  };
  return (
    <div className={classNames('cy-textarea', className, { auto: autoHeight })}>
      <textarea ref={ref} value={inputVal} placeholder={placeholder} onChange={onChangeHandler} />
      <Whether condition={!!clearable && !!inputVal.length}>
        <Icon
          name="close-circle-fill"
          color="var(--assist-color)"
          className="cy-textarea__clear"
          onClick={clearInput}
        />
      </Whether>
      <Whether condition={!!showCount}>
        <div className={classNames({ 'cy-textarea__count': showCount })}>{countStr}</div>
      </Whether>
    </div>
  );
};

export default Textarea;
