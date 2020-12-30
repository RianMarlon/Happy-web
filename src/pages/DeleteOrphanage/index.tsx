import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import api from '../../services/api';

import Loading from '../../components/Loading';

import cancelImg from '../../assets/images/cancel.svg';

import './styles.css';

interface Orphanage {
  name: string;
}

interface OrphanageParams {
  id: string;
}

function DeleteOrphanage() {
  const history = useHistory();

  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [idOrphanage, setIdOrphanage] = useState<Number>();

  const params = useParams<OrphanageParams>();

  useEffect(() => {
    api.get(`/orphanages/${params.id}`)
      .then((response) => {
        const orphanageData = { ...response.data } as Orphanage;

        setOrphanage({ ...orphanageData });
        setIdOrphanage(Number(params.id));
      })
      .catch(() => history.goBack());
  }, [params.id, history]);

  function handleSubmitDeleteOrphanage(event: FormEvent) {
    event.preventDefault();

    api.delete(`/orphanages/${idOrphanage}`)
      .then(() => history.goBack())
      .catch(() => history.goBack());
  }

  if (!orphanage) {
    return <Loading />;
  }

  return (
    <main id="page-delete-orphanage">
      <div className="image-container">
        <img src={cancelImg} alt="" />
      </div>

      <div className="content-container" >
        <div>
          <h1>Excluir!</h1>
          <p>
            {`Você tem certeza que quer excluir ${orphanage.name}?`}
          </p>

          <div className="buttons-container" onClick={() => history.goBack()}>
            <button className="cancel-button">
              Não
            </button>
            
            <button className="confirm-button" onClick={handleSubmitDeleteOrphanage}>
              Sim
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DeleteOrphanage;
