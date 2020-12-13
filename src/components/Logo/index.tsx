import React from 'react';

import logoVerticalImg from '../../assets/images/logo-vertical.svg';

import './styles.css';

function Logo() {
  return (
    <div className="logo-container">
      <img src={logoVerticalImg} alt="" />

      <div className="location">
        <strong>Morada Nova</strong>
        <span>Ceará</span>
      </div>
    </div>
  );
}

export default Logo;
