import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Map, TileLayer } from 'react-leaflet';

import mapMarkerImg from '../../assets/images/map-marker.svg';

import 'leaflet/dist/leaflet.css';
import './styles.css';

function OrphanagesList() {
  return (
    <div id="page-list">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy" />

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando sua visita :)</p>
        </header>
        <footer>
          <strong>Morada Nova</strong>
          <span>Ceará</span>
        </footer>
      </aside>

      <Map 
        center={[-5.1074733, -38.3692486]}
        zoom={15}
        style={{ flex: 1 }}
      >
        <TileLayer 
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} 
        />
      </Map>

      <Link to="#" className="create-orphanage">
        <FiPlus size={32} color="#FFF" />
      </Link>
    </div>
  );
}

export default OrphanagesList;
