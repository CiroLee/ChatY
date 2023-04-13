import { createRoot } from 'react-dom/client';
import { setThemeClass } from './utils/utils';
import App from './App';
import './styles/theme.scss';
import './styles/index.scss';
import 'remixicon/fonts/remixicon.css';
import './styles/reset.css';

const container = document.getElementById('root');

const root = createRoot(container!);

// 整体挂在前设置主题，避免闪烁
(function presetTheme() {
  const themeStorage = localStorage.getItem('theme');
  if (themeStorage) {
    const themeConfig = JSON.parse(themeStorage) as { state: { theme: string } };
    const theme = themeConfig.state.theme;
    setThemeClass(theme);
  }
})();

root.render(<App />);
