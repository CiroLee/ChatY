import type { FC } from 'react';
import SideBar from './SideBar';
import Content from './Content';
const App: FC = () => {
  return (
    <div className="flex relative h-[100vh] overflow-hidden">
      <SideBar />
      <Content />
    </div>
  );
};

export default App;
