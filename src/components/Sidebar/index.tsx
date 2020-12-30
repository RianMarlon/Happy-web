import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiPower } from 'react-icons/fi';

import { removeToken } from '../../services/auth';
import AuthContext from '../../contexts/AuthContext';

import mapMarkerImg from '../../assets/images/map-marker.svg';

import './styles.css';

function Sidebar() {
  const { goBack } = useHistory();
  const { checkToken } = useContext(AuthContext);

  function onClickOff() {
    removeToken();
    checkToken();
  }
  
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
        <button className="button-logout" onClick={onClickOff}>
          <FiPower size={24} strokeWidth={3} />
        </button>
      </footer>
    </aside>
  );
}

export default Sidebar;