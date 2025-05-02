
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Create the root before rendering to properly initialize React
const root = ReactDOM.createRoot(rootElement);

// Render the App inside StrictMode for better development experience
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
