import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FoldShell } from './components/FoldShell';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Service workers require a secure context (HTTPS or localhost). Skip on LAN HTTP.
if (window.isSecureContext) {
  registerSW({ immediate: true });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FoldShell>
      <App />
    </FoldShell>
  </React.StrictMode>,
);
