import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Lazy load Framer Motion to reduce initial bundle size
import('./lib/motion').then(({ initMotion }) => {
  initMotion();
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// PERF: Lazy-loaded Framer Motion to reduce initial JS payload