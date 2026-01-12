import React from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';

import App from './App.jsx';
import './index.css';

if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
