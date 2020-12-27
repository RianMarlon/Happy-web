import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiPower } from 'react-icons/fi';

import mapMarkerImg from '../../assets/images/map-marker.svg';

import './styles.css';

function Sidebar() {
  const { goBack } = useHistory();
  
  return (
    <aside className="app-sidebar">
      <header>
        <Link to="/">
          <img src={mapMarkerImg} alt="Happy" />
        </Link>
        <button type="button" onClick={goBack}>
          <FiArrowLeft size={24} />
        </button>
      </header>

      <footer>
        <button className="button-logout">
          <FiPower size={24} strokeWidth={3} />
        </button>
      </footer>
    </aside>
  );
}

export default Sidebar;