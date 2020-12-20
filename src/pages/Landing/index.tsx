import React from 'react';
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom';

import logoImg from '../../assets/images/logo-horizontal.svg';
import landingImg from '../../assets/images/landing.svg';

import './styles.css';

function Landing() {
  return (
    <div id="page-landing">
      <div className="content-wrapper">
        <header>
          <img src={logoImg} alt="Happy" />

          <div className="location">
            <strong>Morada Nova</strong>
            <span>Ceará</span>
          </div>
        </header>

        <div className="image-landing-container">
          <img src={landingImg} alt="" />
        </div>

        <main>
          <h1>Leve felicidade para o mundo</h1>
          <p>Visite orfanatos e mude o dia de muitas crianças.</p>
        </main>

        <div className="enter-app-container">
          <Link to="/app" className="enter-app">
            <FiArrowRight size={24} color="rgba(0, 0, 0, 0.6)" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Landing;
