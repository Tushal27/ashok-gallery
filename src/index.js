import React from 'react';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
serviceWorkerRegistration.register();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
