
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Handle React errors gracefully
const Root = () => {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
