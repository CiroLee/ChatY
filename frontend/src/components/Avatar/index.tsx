import React, { FC } from 'react';
import Whether from '../Whether';
import Icon from '../Icon';
import classNames from 'classnames';
import './style/index.scss';

export interface AvatarProps {
  url?: string;
  text?: string;
  fontSize?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  shape?: 'circle' | 'square';
  bgColor?: string;
  color?: string;
  boxShadow?: boolean;
  fit?: 'contain' | 'cover' | 'fill' | 'scale-down' | 'none';
  status?: 'online' | 'offline';
  dot?: boolean | string;
  checked?: boolean;
  className?: string;
  onClick?: () => void;
}
const Avatar: FC<AvatarProps> = (props) => {
  const {
    text = '',
    fit = 'cover',
    size = 'medium',
    fontSize = '0.45em',
    bgColor = '#d6d6d6',
    shape = 'circle',
    color = '#fff',
    checked,
  } = props;
  const calcFontScale = (text: string): number => {
    if (text.length > 1) {
      return 2 / text.length;
    }
    return 1;
  };
  const styleVars = {
    '--avatar-text-color': color,
    '--avatar-font-size': fontSize,
    '--avatar-fit': fit,
    '--avatar-bg': bgColor,
    '--avatar-text-scale': calcFontScale(text),
  } as React.CSSProperties;

  const onClickHandler = () => {
    props.onClick?.();
  };
  return (
    <div
      className={classNames('cy-avatar', size, shape, props.status, props.className, { 'box-shadow': props.boxShadow })}
      data-dot={props.dot}
      style={styleVars}
      onClick={onClickHandler}>
      <Whether condition={!!props.url}>
        <img src={props.url} alt="" />
      </Whether>
      <Whether condition={!props.url && !!props.text}>
        <span className={classNames('cy-avatar__text')}>{props.text}</span>
      </Whether>
      <Whether condition={!!props.dot}>
        <div className={classNames('cy-avatar__dot', { 'num-dot': typeof props.dot === 'string' })}>
          <span>{props.dot}</span>
        </div>
      </Whether>
      <Whether condition={!!props.checked}>
        <div className={classNames('cy-avatar__checked')}>
          <Icon name="check-line" size="12px" />
        </div>
      </Whether>
    </div>
  );
};

export default Avatar;
