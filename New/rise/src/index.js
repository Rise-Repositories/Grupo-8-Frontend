import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import pt_BR from 'antd/locale/pt_BR';

// CSS STYLES

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider locale={pt_BR}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
