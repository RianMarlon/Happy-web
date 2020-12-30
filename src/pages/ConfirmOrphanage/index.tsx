import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { FiCheck, FiPlus, FiX, FiXCircle } from 'react-icons/fi';

import api from '../../services/api';

import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Loading from '../../components/Loading';
import Success from '../../components/Success';

import mapIcon from '../../utils/mapIcon';

import './styles.css';

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
    url: string
  }>;
}

interface OrphanageParams {
  id: string;
}

function ConfirmOrphanage() {
  const history = useHistory();

  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [idOrphanage, setIdOrphanage] = useState<Number>();

  const params = useParams<OrphanageParams>();

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    api.get(`/orphanages/${params.id}`)
      .then((response) => {
        const orphanageData = { ...response.data } as Orphanage;

        setOrphanage({ ...orphanageData });
        setIdOrphanage(Number(params.id));
      })
      .catch(() => history.goBack());
  }, [params.id, history]);
    
  function goDeleteOrphanage() {
    history.push(`/orphanages/delete/${idOrphanage}`)
  }

  function handleSubmitAcceptOrphanage(event: FormEvent) {
    event.preventDefault();

    api.put(`/orphanages/${idOrphanage}/confirm`)
      .then(() => {
        setIsSuccess(true);
      })
      .catch(() => history.goBack());
  }

  if (!orphanage) {
    return <Loading />;
  }

  return (
    <>
      {!isSuccess ? (
        <div id="page-confirm-orphanage">
          <Sidebar />

          <main>
            <h1>{`Aceitar ${orphanage.name}`}</h1>
            <form className="confirm-orphanage-form">
              <div>
                <fieldset>
                  <legend>Dados</legend>
                  <Map 
                    className="map"
                    center={[orphanage.latitude, orphanage.longitude]} 
                    style={{ width: '100%' }}
                    zoom={15.50292}
                  >
                    <TileLayer 
                      url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                    />

                    <Marker 
                      interactive={false}
                      icon={mapIcon}
                      position={[orphanage.latitude, orphanage.longitude]} 
                    />
                    
                  </Map>
                  <Input 
                    name="orphanage"
                    label="Nome"
                    value={orphanage?.name}
                    labelError="Nome não informado"
                    error={false}
                    readOnly={true}
                  />

                  <Textarea 
                    name="about"
                    label="Sobre"
                    value={orphanage?.about}
                    labelError="Informações sobre o orfanato não fornecidas"
                    error={false}
                    comment="Máximo de 500 caracteres"
                    readOnly={true}
                  />

                  <Input
                    name="whatsapp"
                    label="Número do Whatsapp"
                    value={orphanage.whatsapp}
                    labelError="Número do Whatsapp não informado"
                    error={false}
                    readOnly={true}
                  />

                  <div className="input-container">
                    <label htmlFor="images">
                      Fotos
                    </label>
                    <div className="images-container">
                      { orphanage.images.map((image, index) => {
                        return (
                          <div key={image.id} className="image-container">
                            <button type="button" disabled={true}>
                              <FiX size={24} color="#FF669D" />
                            </button>
                            <img src={image.url} alt="" />
                          </div>
                        )
                      })}

                      <label htmlFor="image" className="new-image">
                        <FiPlus size={24} color="#15B6D6" />
                      </label>
                    </div>

                    <input multiple type="file" id="image" disabled={true} />
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Visitação</legend>
                  
                  <Textarea 
                    name="instructions"
                    label="Instruções"
                    value={orphanage.instructions}
                    labelError="Instruções sobre o orfanato não fornecidas"
                    error={false}
                    comment="Máximo de 500 caracteres"
                    readOnly={true}
                  />

                  <div className="opening-hours-block">
                    <Input 
                      name="openFrom"
                      label="Horário de abertura"
                      value={orphanage.open_from}
                      labelError="Horário não informado"
                      error={false}
                      type="time"
                      readOnly={true}
                    />

                    <Input 
                      name="openUntil"
                      label="Horário de fechamento"
                      value={orphanage.open_until}
                      labelError="Horário não informado"
                      error={false}
                      type="time"
                      readOnly={true}
                    />
                  </div>

                  <div className="input-container">
                    <label htmlFor="open_on_weekends">Atende fim de semana</label>

                    <div className="button-select">
                      <button
                        className={orphanage.open_on_weekends ? 'active' : ''}
                        type="button"
                      >
                        Sim
                      </button>
                      <button 
                        className={!orphanage.open_on_weekends ? 'active' : ''}
                        type="button"
                      >
                        Não
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="buttons-submit">
                <button className="refuse" onClick={goDeleteOrphanage}>
                  <FiXCircle size={24} />
                  <p>
                    Recusar
                  </p>
                </button>
                <button className="accept" onClick={handleSubmitAcceptOrphanage}>
                  <FiCheck size={24} />
                  <p>
                    Aceitar
                  </p>
                </button>
              </div>
            </form>
          </main>
        </div>
      ) : (
        <Success 
          title="Orfanato aceito!"
          description={`${orphanage.name} foi aceito, agora você pode visualizá-lo na lista dos orfanatos cadastrados.`}
          textButton="Voltar aos cadastros pendentes"
        />
      )}
    </>
  );
}

export default ConfirmOrphanage;
