import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from '@/context/theme-context';
import { WebsiteDataProvider } from '@/context/website-data-context';
import { AuthProvider } from '@/context/auth-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <WebsiteDataProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </WebsiteDataProvider>
    </ThemeProvider>
  </StrictMode>,
);
