import { FC, useEffect, useState } from 'react';
import Icon from '../Icon';
import classNames from 'classnames';
import './style/index.scss';
import { Option } from '@/types/common';
interface RadioProps {
  type?: 'checked' | 'circle';
  checked?: boolean;
  className?: string;
  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}

interface RadioGroupProps {
  type?: 'checked' | 'circle';
  defaultKey?: string | number;
  options: Option[];
  className?: string;
  onChange?: (item: Option, checked: boolean) => void;
}
const Radio: FC<RadioProps> = (props) => {
  const { type = 'checked', checked, className, children } = props;
  const [checkedVal, setCheckedVal] = useState(false);
  const toggleChecked = () => {
    setCheckedVal(!checkedVal);
    props.onChange?.(!checkedVal);
  };

  useEffect(() => {
    setCheckedVal(!!checked);
  }, [checked]);
  return (
    <div className={classNames('cy-radio', className, { checked: checkedVal })} onClick={toggleChecked}>
      {type === 'circle' ? (
        <div className={checkedVal ? 'cy-radio__circle-checked' : 'cy-radio__circle'}></div>
      ) : (
        <Icon name={checkedVal ? 'checkbox-circle-fill' : 'checkbox-blank-circle-line'} size="18.5px" />
      )}
      <div className={classNames('cy-radio__content')}>{children}</div>
    </div>
  );
};

export const RadioGroup: FC<RadioGroupProps> = (props) => {
  const { defaultKey, type, options, className, onChange } = props;
  const [activeVal, setActiveVal] = useState<number | string>();
  const radioChangeHandler = (item: Option, checked: boolean) => {
    setActiveVal(item.value);
    onChange?.(item, checked);
  };

  useEffect(() => {
    setActiveVal(defaultKey);
  }, [defaultKey]);

  return (
    <div className={classNames('cy-radio-group', className)}>
      {options.map((item) => (
        <Radio
          key={item.value}
          type={type}
          checked={item.value === activeVal}
          onChange={(checked) => radioChangeHandler(item, checked)}>
          {item.label}
        </Radio>
      ))}
    </div>
  );
};

export default Radio;
