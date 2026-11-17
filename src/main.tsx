import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App, AppProviders } from '@/app';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/shared/styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
