import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './styles/theme.scss';
import './styles/reset.css';

const container = document.getElementById('root');

const root = createRoot(container!);

root.render(<App />);
