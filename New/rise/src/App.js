import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import Rotas from "./routes";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <React.StrictMode>
      <Rotas />
      <ToastContainer />
    </React.StrictMode>
  );
}
export default App;
