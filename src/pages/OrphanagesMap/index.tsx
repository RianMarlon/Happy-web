import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight, FiPower } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import Leaflet from 'leaflet';

import { removeToken } from '../../services/auth';
import AuthContext from '../../contexts/AuthContext';

import api from '../../services/api';

import mapMarkerImg from '../../assets/images/map-marker.svg';

import './styles.css';

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [50, 60],
  iconAnchor: [25, 60],
  popupAnchor: [170, 8],
});

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

function OrphanagesMap() {
  
  const { checkToken } = useContext(AuthContext);
  
  const [myLocation, setMyLocation] = useState({ latitude: -5.1069647, longitude: -38.3761372 });
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setMyLocation({ latitude: coords.latitude, longitude: coords.longitude });
    });
    
    api.get('/orphanages')
    .then((response) => {
      setOrphanages(response.data);
    });
  }, []);
  
  function onClickOff() {
    removeToken();
    checkToken();
  }
  
  return (
    <div id="page-map">
      <aside>
        <header>
          <Link to="/">
            <img src={mapMarkerImg} alt="Happy" />
          </Link>

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando sua visita :)</p>
        </header>
        <footer>
          <div>
            <strong>Morada Nova</strong>
            <span>Ceará</span>
          </div>

          <button className="button-logout" onClick={onClickOff}>
            <FiPower size={24} color="#FFF" strokeWidth={3} />
          </button>
        </footer>
      </aside>

      <Map 
        center={[myLocation.latitude, myLocation.longitude]}
        zoom={15.50292}
        style={{ flex: 1 }}
      >
        <TileLayer 
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} 
        />

        {
          orphanages.map((orphanage) => {
            return (
              <Marker
                icon={mapIcon}
                position={[orphanage.latitude, orphanage.longitude]}
                key={orphanage.id}
              >
                <Popup closeButton={false} minWidth={180} maxWidth={460} className="map-popup">
                  { orphanage.name.length <= 30
                    ? orphanage.name 
                    : `${orphanage.name.slice(0, 30)}...`
                  }
                  <Link to={`/orphanages/${orphanage.id}`}>
                    <FiArrowRight size={20} color="#FFF" />
                  </Link>
                </Popup>
              </Marker>
            );
          })
        }
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus className="fi-plus" size={26} color="#FFF" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;
