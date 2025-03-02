import React from 'react';
import ReactDOM from 'react-dom/client';
import { StoreProvider } from './Stores';
import App from './App';
import './main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
