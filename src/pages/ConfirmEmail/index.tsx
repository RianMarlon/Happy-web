import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';

import Success from '../../components/Success';
import SplashScreen from '../../components/SplashScreen';

import './styles.css';

function ConfirmEmail(props: any) {

  const history = useHistory();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = props.location.search;
    const token = query.split('token=')[1];
    
    const data = {
      token
    }

    api.put('/confirm-email', data)
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        history.push('/login');
      });
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Success 
      title="E-mail confirmado!"
      description="Seu e-mail foi confirmado, agora você pode realizar o login no Happy."
      textButton="Voltar ao login"
      routeButton="/login"
    />
  );
}

export default ConfirmEmail;