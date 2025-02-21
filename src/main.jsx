import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import store from './store/store.js';
import { Provider } from 'react-redux';
import AuthProvider from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
  </AuthProvider>
  </StrictMode>
);