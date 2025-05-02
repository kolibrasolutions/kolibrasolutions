
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Find the root element
const rootElement = document.getElementById('root');

// Ensure the root element exists before trying to use it
if (!rootElement) {
  throw new Error('Root element not found');
}

// Create the root with the element
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
