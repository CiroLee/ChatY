import { FC, useEffect, useState } from 'react';
import './style/index.scss';

interface SwitchProps {
  size?: 'small' | 'medium' | 'large';
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

interface ISize {
  width: string;
  height: string;
  circle2Radius: string;
  circleAniLen: string;
  marginLeftAni: string;
}
const sizeSchema = {
  small: {
    width: '30px',
    height: '16px',
    circle2Radius: '12px',
    circleAniLen: '2px',
    marginLeftAni: '14px',
  },
  medium: {
    width: '42px',
    height: '24px',
    circle2Radius: '20px',
    circleAniLen: '3px',
    marginLeftAni: '18px',
  },
  large: {
    width: '54px',
    height: '30px',
    circle2Radius: '26px',
    circleAniLen: '4px',
    marginLeftAni: '24px',
  },
};

const getSize = (size: 'small' | 'medium' | 'large'): ISize => {
  return sizeSchema[size] ? sizeSchema[size] : sizeSchema.medium;
};

const Switch: FC<SwitchProps> = (props) => {
  const { size = 'medium', checked, disabled } = props;
  const [isChecked, setIsChecked] = useState(false);
  const { width, height, circle2Radius: diameter, circleAniLen: len, marginLeftAni: ml } = getSize(size);
  const cssVariables = {
    '--sw-width': width,
    '--sw-height': height,
    '--diameter': diameter,
    '--ani-len': len,
    '--ml': ml,
  } as React.CSSProperties;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    props.onChange?.(target.checked);
  };

  useEffect(() => {
    setIsChecked(!!checked);
  }, [checked]);
  return (
    <div className="cy-switch" style={cssVariables}>
      <input checked={isChecked} disabled={disabled} type="checkbox" name="switch" onChange={handleChange} />
      <div className="cy-switch-label"></div>
    </div>
  );
};

export default Switch;
