import React from 'react';

import Sidebar from '../Sidebar';

import loadingAnimatedImg from '../../assets/images/loading.svg';

import './styles.css';

function Loading() {
  return (
    <div className="loading">
      <Sidebar />
      <div className="loading-container">
        <img src={loadingAnimatedImg} alt="Carregando" />
      </div>
    </div>
  );
}

export default Loading;