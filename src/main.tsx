
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Create root and render - removed StrictMode as it might be causing issues with hooks
ReactDOM.createRoot(rootElement).render(<App />);
