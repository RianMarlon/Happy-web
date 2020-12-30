import React, { useContext } from 'react';
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext';

import logoImg from '../../assets/images/logo-horizontal.svg';
import landingImg from '../../assets/images/landing.svg';

import './styles.css';

function Landing() {

  const { isAdmin } = useContext(AuthContext);
  
  return (
    <div id="page-landing">
      <div className="content-wrapper">
        <header>
          { isAdmin  ? (
            <>
              <div>
                <img src={logoImg} alt="Happy" />
    
                <div className="location">
                  <strong>Morada Nova</strong>
                  <span>Ceará</span>
                </div>
              </div>
              <Link to="/orphanages-confirmed" className="access-restricted">
                Acesso restrito
              </Link>
            </>
          ) : (
            <>
              <img src={logoImg} alt="Happy" />
  
              <div className="location">
                <strong>Morada Nova</strong>
                <span>Ceará</span>
              </div>
            </>
          )}
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
