import { FC } from 'react';
interface WhetherProps {
  condition: boolean;
  children: React.ReactNode;
}
const Whether: FC<WhetherProps> = ({ condition, children }) => {
  return <>{condition ? children : null}</>;
};

export default Whether;
