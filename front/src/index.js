import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import './i18n';

const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme === 'light' || savedTheme === 'dark'
  ? savedTheme
  : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

document.documentElement.dataset.bsTheme = initialTheme;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <App />
  </Router>
);
