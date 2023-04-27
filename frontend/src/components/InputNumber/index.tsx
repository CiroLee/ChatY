import { FC, useEffect, useState } from 'react';
import Input, { InputProps } from '../Input';
import './style/index.scss';
import Whether from '../Whether';
interface InputNumberProps extends InputProps {
  min: number;
  max: number;
  step: number;
  value: number;
  suffix?: React.ReactNode;
}

const InputNumber: FC<InputNumberProps> = (props) => {
  const { min, max, step, value, suffix, ...rest } = props;
  const [numVal, setNumVal] = useState<string | number>(value);
  const onChangeHandler = (val: string) => {
    setNumVal(val);
  };
  const onBlurHandler = (val: string) => {
    // 不是数字 重置
    if (!/^([1-9]\d*|0)(\.\d+)?$/.test(val)) {
      setNumVal(value);
      return;
    }
    const num = Number(val);
    let valueNum = num;
    if (num < min) {
      setNumVal(min);
      valueNum = min;
    } else if (num > max) {
      setNumVal(max);
      valueNum = max;
    } else {
      const decimal = String(step).split('.')[1];
      const fixed = decimal ? 10 ** decimal.length : 1;
      valueNum = Math.round(num * fixed) / fixed;
      setNumVal(valueNum);
    }

    props.onBlur?.(valueNum.toString());
  };
  useEffect(() => {
    setNumVal(value);
  }, [value]);
  return (
    <div className="cy-input-number">
      <Input value={numVal} {...rest} onChange={onChangeHandler} onBlur={onBlurHandler} />
      <Whether condition={!!suffix}>
        <div className="cy-input-number__suffix">{suffix}</div>
      </Whether>
    </div>
  );
};

export default InputNumber;
