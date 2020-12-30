import React from 'react';

import Routes from './routes';

import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { AuthProvider } from './contexts/AuthContext';

import './assets/styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
