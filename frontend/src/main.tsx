import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/theme.scss';
import './styles/index.scss';
import 'remixicon/fonts/remixicon.css';
import './styles/reset.css';

const container = document.getElementById('root');

const root = createRoot(container!);

root.render(<App />);
