import React, { useEffect, useRef, useState } from 'react';

import api from '../../services/api';

import SidebarDashboard from '../../components/SidebarDashboard';
import OrphanageItem from '../../components/OrphanageItem';

import loadingAnimatedImg from '../../assets/images/loading.svg';
import sadImg from '../../assets/images/sad.svg';

import './styles.css';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

function OrphanagesConfirmed() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [quantityOrphanagesConfirmed, setQuantityOrphanagesConfirmed] = useState(0);

  const [isFirstSearch, setIsFirstSearch] = useState(true);

  const [showLoading, setShowLoading] = useState(false);
  const [scrollRadio, setScrollRadio] = useState(Number);

  const [page, setPage] = useState(1);
  const perPage = 5;

  const scrollObservable = useRef<HTMLDivElement>(null);
  const intersectionObserver = new IntersectionObserver((entries) => {
    const radio = entries[0].intersectionRatio;
    setScrollRadio(radio);
  });

  useEffect(() => {
    loadOrphanagesConfirmed()
      .then(() => {
        setIsFirstSearch(false);
      });

    if (scrollObservable.current) {
      intersectionObserver.observe(scrollObservable.current);
    }
    
    return () => {
      intersectionObserver.disconnect();
    }

  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isFirstSearch && scrollRadio > 0) {
      loadOrphanagesConfirmed();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRadio]);

  async function loadOrphanagesConfirmed() {
    if (quantityOrphanagesConfirmed !== 0 && 
      perPage * page > quantityOrphanagesConfirmed + perPage) {
      return;
    }

    setShowLoading(true);
    
    await getOrphanagesConfirmed();
    
    setShowLoading(false);
    setPage(page + 1);
  }

  async function getOrphanagesConfirmed() {
    const params = {
      page,
      per_page: perPage
    }
    
    const response = await api.get('/orphanages-confirmed', { params });

    if (response) {
      const {
        orphanages_by_page: orphanagesByPage,
        quantity_confirmed: quantityConfirmed
      } = response.data;
      
      setQuantityOrphanagesConfirmed(quantityConfirmed);

      if (params.page === 1) {
        setOrphanages([...orphanagesByPage]);
      }

      else {
        setOrphanages([...orphanages, ...orphanagesByPage]);
      }
    }
  }

  return (
    <div id="page-orphanages-confirmed">
      <SidebarDashboard buttonActive="confirmed" />
      <main>
        <div>
          <div className="title-container">
            <div className="title-content">
              <h1>
                Orfanatos Cadastrados
              </h1>
              {
                quantityOrphanagesConfirmed > 0 && (
                  <div className="quantity-orphanages">
                    {`${quantityOrphanagesConfirmed} ${quantityOrphanagesConfirmed > 1 ? 'orfanatos' : 'orfanato'}`}
                  </div>
                )
              }
            </div>
            <div className="line" />
          </div>
          <div className="orphanages-confirmed-container">
            { orphanages.length > 0 ? (
              <div className="orphanages-confirmed-items">
                {orphanages.map((orphanage: Orphanage) => (
                    <OrphanageItem key={orphanage.id} orphanage={orphanage} pending={false} />
                  )
                )}
              </div>
            ) : (
              !isFirstSearch && (
                <div className="no-results">
                  <div>
                    <img src={sadImg} alt="Nenhum resultado" />
                    <p>
                      Nenhum no momento
                    </p>
                  </div>
                </div>
              )
            )}

            <div ref={scrollObservable}></div>

            { orphanages.length > 0 && showLoading && (
              <div className="loading">
                <img src={loadingAnimatedImg} alt=""/>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default OrphanagesConfirmed;