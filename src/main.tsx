
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');

// Check if root element exists
if (!rootElement) {
  throw new Error('Root element not found');
}

// Create root with ReactDOM.createRoot
const root = ReactDOM.createRoot(rootElement);

// Render application - put back React.StrictMode since removing it caused issues
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
