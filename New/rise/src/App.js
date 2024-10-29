import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import Rotas from "./routes";
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './pages/login/AuthContext';
import { OngProvider } from './components/context/ongContext/OngContext';

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <OngProvider>
          <Rotas />
          <ToastContainer />
        </OngProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
export default App;
