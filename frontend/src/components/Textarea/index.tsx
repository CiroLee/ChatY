import { FC, useState, useEffect } from 'react';
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
  showCount?: boolean;
  rows?: number;
  onChange?: (value: string) => void;
  onEnter?: () => void;
}

const Textarea: FC<TextAreaProps> = (props) => {
  const { value, placeholder, className, maxLength, clearable, rows = 5, showCount, onChange } = props;
  const [inputVal, setInputVal] = useState(value);
  const [countStr, setCountStr] = useState('');

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLength && e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }
    setInputVal(e.target.value);
    onChange?.(e.target.value);
    showCount && calcCountStr();
  };
  const clearInput = () => {
    setInputVal('');
    onChange?.('');
    showCount && calcCountStr('0');
  };

  const calcCountStr = (length?: string) => {
    if (maxLength) {
      setCountStr(`${length || inputVal.length}/${maxLength}`);
    } else {
      setCountStr(`${length || inputVal.length}`);
    }
  };

  useEffect(() => {
    setInputVal(value);
    if (showCount) {
      const lengthStr = String(value).length;
      calcCountStr(lengthStr.toString());
    }
  }, [value]);

  return (
    <div className={classNames('cy-textarea', className)}>
      <textarea value={inputVal} rows={rows} placeholder={placeholder} onChange={onChangeHandler} />
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
