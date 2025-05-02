
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

// Render application WITHOUT React.StrictMode since it's already in App.tsx
root.render(<App />);
