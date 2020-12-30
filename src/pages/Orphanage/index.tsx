import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiClock, FiInfo } from 'react-icons/fi';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { FaWhatsapp } from 'react-icons/fa'

import api from '../../services/api';

import Sidebar from '../../components/Sidebar';

import mapIcon from '../../utils/mapIcon';

import './styles.css';
import Loading from '../../components/Loading';

interface Image {
  id: number;
  url: string;
}

interface Orphanage {
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  whatsapp: string;
  instructions: string;
  open_from: number;
  open_until: number;
  open_on_weekends: boolean;
  images: Array<{
    id: number;
    url: string;
  }>;
}

interface OrphanageParams {
  id: string;
}

function Orphanage() {
  const params = useParams<OrphanageParams>();
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    api.get(`/orphanages/${params.id}`)
      .then((response) => {
        const orphanageData = { ...response.data } as Orphanage;

        setOrphanage({ ...orphanageData });
      });
  }, [params.id]);

  if (!orphanage) {
    return <Loading />;
  }

  return (
    <div id="page-orphanage">
      <Sidebar /> 

      <main>
        <h1>{`Perfil ${orphanage.name}`}</h1>
        <div className="orphanage-details">
          <img src={orphanage.images[activeImageIndex].url} alt={orphanage.name} />

          <div className="images"> 
            { 
              orphanage.images.map((image: Image, index) => {
                return (
                  <button 
                    key={image.id} 
                    className={index === activeImageIndex ? "active" : ""}
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(index)
                    }}
                  >
                    <img src={image.url} alt={orphanage.name} />
                  </button>
                );
              })
            }
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map 
                className="map"
                center={[orphanage.latitude, orphanage.longitude]} 
                zoom={17}
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

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>
                  Ver rotas no Google Maps
                </a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <div className="icon">
                  <FiClock size={32} color="#15B6D6" />
                </div>
                Segunda à 
                {' '}
                { orphanage.open_on_weekends ? 'domingo' : 'sexta' }
                {' '}
                das {orphanage.open_from} até as {orphanage.open_until}
              </div>
              {
                orphanage.open_on_weekends ? (
                  <div className="open-on-weekends">
                    <div className="icon">
                      <FiInfo size={32} color="#39CC83" />
                    </div>
                    Atendemos fim de semana
                  </div>
                ) : (
                  <div className="open-on-weekends dont-open">
                    <div className="icon">
                      <FiInfo size={32} color="#FF669D" />
                    </div>
                    Não atendemos fim de semana
                  </div>
                )
              }
            </div>

            <a
              className="contact-button"
              href={`https://wa.me/${orphanage.whatsapp}`} 
              target="__blank"
            >
              <FaWhatsapp size={22} color="#FFF" />
              Entrar em contato
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Orphanage;