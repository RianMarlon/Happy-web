import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiAlertCircle, FiArrowLeft, FiMapPin, FiPower } from 'react-icons/fi';

import { removeToken } from '../../services/auth';
import AuthContext from '../../contexts/AuthContext';

import mapMarkerImg from '../../assets/images/map-marker.svg';

import './styles.css';

interface SidebarDashboardProps {
  buttonActive: 'pending' | 'confirmed'
}

function SidebarDashboard({ buttonActive }: SidebarDashboardProps) {
  const history = useHistory();
  const { checkToken } = useContext(AuthContext);

  function onClickOff() {
    removeToken();
    checkToken();
  }

  function goLanding() {
    history.push('/');
  }
  
  return (
    <aside className="app-sidebar-dashboard">
      <header>
        <Link to="/">
          <img src={mapMarkerImg} alt="Happy" />
        </Link>
        <button onClick={goLanding}>
          <FiArrowLeft size={24} />
        </button>
      </header>

      <div>
        <Link className={buttonActive === "confirmed" ? "active" : ""}
          to="/orphanages-confirmed"
        >
          <FiMapPin size={24} />
        </Link>
        <Link className={buttonActive === "pending" ? "active" : ""}
          to="/orphanages-pending"
        >
          <FiAlertCircle size={24} />
        </Link>
      </div>

      <footer>
        <button className="button-logout" onClick={onClickOff}>
          <FiPower size={24} strokeWidth={3} />
        </button>
      </footer>
    </aside>
  );
}

export default SidebarDashboard;