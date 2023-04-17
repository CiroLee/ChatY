import { FC, useEffect } from 'react';
import { useToggle } from 'react-use';
import { useLayoutStore } from '@/store/layout';
import { useHotkeys } from 'react-hotkeys-hook';
import Icon from '../Icon';
import { isMac } from '@/utils/utils';
import { WindowToggleMaximise, WindowUnmaximise, WindowMinimise } from '@wails/runtime';
import { Quit } from '@wails/runtime';
import './style/index.scss';
interface TitleBarProps {
  fullscreenCallback: () => void;
  quitCallback: () => void;
  minimizeCallback: () => void;
  isFullscreen?: boolean;
}
const MacTitleBar: FC<TitleBarProps> = (props) => {
  const { isFullscreen, fullscreenCallback, minimizeCallback, quitCallback } = props;
  return (
    <div className="mac-titlebar" style={{ '--wails-draggable': 'drag' } as React.CSSProperties}>
      <div className="titlebar__btn-group">
        <li className="mac-titlebar__btn close" onClick={quitCallback}>
          <Icon name="close-line" size="10px" />
        </li>
        <li className="mac-titlebar__btn minimize" onClick={minimizeCallback}>
          <i className="minimize-icon"></i>
        </li>
        <li className="mac-titlebar__btn fullscreen" onClick={fullscreenCallback}>
          <Icon name={`${isFullscreen ? 'contract-up-down-fill' : 'expand-up-down-fill'}`} size="10px" />
        </li>
      </div>
    </div>
  );
};

const WindowTitleBar: FC<TitleBarProps> = (props) => {
  const { fullscreenCallback, minimizeCallback, quitCallback } = props;
  return (
    <div className="win-titlebar" style={{ '--wails-draggable': 'drag' } as React.CSSProperties}>
      <div className="titlebar__btn-group">
        <li className="win-titlebar__btn" onClick={minimizeCallback}>
          <i className="minimize-icon"></i>
        </li>
        <li className="win-titlebar__btn" onClick={fullscreenCallback}>
          <Icon name="checkbox-blank-line" size="13px" />
        </li>
        <li className="win-titlebar__btn" onClick={quitCallback}>
          <Icon name="close-line" size="14px" />
        </li>
      </div>
    </div>
  );
};

const TitleBar: FC = () => {
  const [fullscreen, toggleFullscreen] = useToggle(false);
  const { setTitleBarHeight } = useLayoutStore((state) => state);
  // Esc 退出最大化
  useHotkeys('escape', (event: KeyboardEvent) => {
    event.preventDefault();
    if (fullscreen) {
      WindowUnmaximise();
      toggleFullscreen(false);
    }
  });
  // mac meta + m 最小化
  useHotkeys('meta+m', (event: KeyboardEvent) => {
    event.preventDefault();
    WindowMinimise();
  });

  // 无边框模式似乎不支持全屏
  // 最大化切换
  const handleToggleFullscreen = () => {
    WindowToggleMaximise();
    toggleFullscreen();
  };
  useEffect(() => {
    if (isMac()) {
      setTitleBarHeight(28);
    } else {
      setTitleBarHeight(32);
    }
  }, []);
  return isMac() ? (
    <MacTitleBar
      isFullscreen={fullscreen}
      quitCallback={Quit}
      minimizeCallback={WindowMinimise}
      fullscreenCallback={handleToggleFullscreen}
    />
  ) : (
    <WindowTitleBar quitCallback={Quit} minimizeCallback={WindowMinimise} fullscreenCallback={handleToggleFullscreen} />
  );
};

export default TitleBar;
