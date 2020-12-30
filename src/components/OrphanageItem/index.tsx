import React from 'react';
import { FiArrowRight, FiEdit3, FiTrash } from 'react-icons/fi';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';

import mapIcon from '../../utils/mapIcon';

import './styles.css';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface OrphanageItem {
  orphanage: Orphanage;
  pending: boolean;
}

function OrphanageItem({ orphanage, pending}: OrphanageItem) {
  return (
    <div className="orphanage-item">
      <div className="map-container">
        <Map 
          center={[orphanage.latitude, orphanage.longitude]} 
          zoom={15}
          dragging={false}
          touchZoom={false}
          zoomControl={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
        >
          <TileLayer 
            url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
          />
          <Marker interactive={false} icon={mapIcon} position={[orphanage.latitude, orphanage.longitude]} />
        </Map>
      </div>
      <div className="orphanage-info">
        <p>
          { orphanage.name.length <= 20
            ? orphanage.name 
            : `${orphanage.name.slice(0, 20)}...`
          }
        </p>
        <div>
          { pending ? (
              <Link to={`/orphanages/confirm/${orphanage.id}`}>
                <FiArrowRight size={24} />
              </Link>
            ) : (
              <>
                <Link to={`/orphanages/edit/${orphanage.id}`}>
                  <FiEdit3 size={24} />
                </Link>
                <Link to={`/orphanages/delete/${orphanage.id}`}>
                  <FiTrash size={24} />
                </Link>
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default OrphanageItem;