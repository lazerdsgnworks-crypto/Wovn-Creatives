import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from '@/context/theme-context';
import { WebsiteDataProvider } from '@/context/website-data-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <WebsiteDataProvider>
        <App />
      </WebsiteDataProvider>
    </ThemeProvider>
  </StrictMode>,
);
