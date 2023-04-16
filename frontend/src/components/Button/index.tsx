import { FC } from 'react';
import classNames from 'classnames';
import './style/index.scss';
interface ButtonProps {
  type?: 'primary' | 'default';
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}
type ButtonEvent = React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>;
const Button: FC<ButtonProps> = (props) => {
  const { type, disabled, className, children } = props;
  const buttonOnClickHandler = (event: ButtonEvent) => {
    if (props.onClick) {
      (props.onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(event);
    }
  };
  return (
    <button className={classNames('cy-button', type, className)} disabled={disabled} onClick={buttonOnClickHandler}>
      {children}
    </button>
  );
};

export default Button;
