import { FC, useState, useEffect } from 'react';
import Whether from '../Whether';
import Icon from '../Icon';
import classNames from 'classnames';
import './style/index.scss';
interface InputProps {
  value: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  clearable?: boolean;
  showCount?: boolean;
  onChange?: (value: string) => void;
}

const Input: FC<InputProps> = (props) => {
  const { value, placeholder, className, maxLength, clearable, showCount, onChange } = props;
  const [inputVal, setInputVal] = useState(value);
  const [focus, setFocus] = useState(false);
  const [countStr, setCountStr] = useState('');
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    calcCountStr();
  }, [showCount]);

  return (
    <div className={classNames('cy-input', className, { focus })}>
      <input
        type="text"
        value={inputVal}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={onChangeHandler}
      />
      <div className={classNames('cy-input__trail', { 'cy-input__count': showCount })} data-count={countStr}>
        <Whether condition={!!clearable && !!inputVal.length}>
          <Icon name="close-circle-fill" className="cy-input__clear" onClick={clearInput} />
        </Whether>
      </div>
    </div>
  );
};

export default Input;
