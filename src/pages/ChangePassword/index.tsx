import React, { FormEvent, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';
import useForm from '../../hooks/useForm';

import InputPassword from '../../components/InputPassword';
import Logo from '../../components/Logo';
import SplashScreen from '../../components/SplashScreen';
import Success from '../../components/Success';

import './styles.css';

function ChangePassword(props: any) {

  const history = useHistory();

  const initialFields = {
    password: '',
    confirmPassword: '',
  }
  
  const [
    form, errors,
    updateField, validateFields,
    hasOneFieldEmpty,
  ] = useForm(initialFields);

  const [token, setToken] = useState('');
  
  const [buttonSubmitDisabled, setButtonSubmitDisabled] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const [differentPasswords, setDifferentPasswords] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = props.location.search;
    const token = query.split('token=')[1];
    
    const data = {
      token
    }

    api.post('/validate-token', data)
      .then((response) => {
        const { is_valid_token: isTokenValid } = response.data;

        if (!isTokenValid) {
          history.push('/forgot-password');
        }

        else {
          setToken(token);
        }

        setLoading(false);
      })
      .catch(() => {
        history.push('/forgot-password');
      });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (hasOneFieldEmpty()) {
      setButtonSubmitDisabled(true);
    }

    else {
      setButtonSubmitDisabled(false);
    }
  }, [form, hasOneFieldEmpty]);

  useEffect(() => {
    setDifferentPasswords(false);
  }, [form.confirmPassword]);

  function handleSubmitChangePassword(e: FormEvent) {
    e.preventDefault();

    validateFields();

    if (hasOneFieldEmpty()) {
      return;
    }

    if (form.password !== form.confirmPassword) {
      setDifferentPasswords(true);
      return;
    }

    const data = {
      password: form.password,
      confirm_password: form.confirmPassword,
      token
    }

    api.put('/change-password', data)
      .then(() => {
        setIsSuccess(true);
      })
      .catch(({ response }) => {
        const data = response.data;
        const messageError = data.messagesError[0];
        
        toast.error(messageError, {
          autoClose: 5000
        });
      });
  }

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <>
      { !isSuccess ? (
        <div id="page-change-password">
          <ToastContainer />
          <header>
            <Logo />
          </header>
          <main>
            <div className="change-password-content">
              <div className="body">
                <div>
                  <h1>Redefinição de senha</h1>
                  <p>Escolha uma nova senha para você acessar o Happy</p>
                </div>
                <form onSubmit={handleSubmitChangePassword} method="POST">
                  <InputPassword
                    name="password"
                    label="Nova senha"
                    value={form.password}
                    onChange={updateField}   
                    labelError="Senha não informada"
                    error={errors.password}
                  />

                  <InputPassword
                    name="confirmPassword"
                    label="Confirme sua nova senha"
                    value={form.confirmPassword}
                    error={errors.confirmPassword || differentPasswords}
                    onChange={updateField}
                    labelError={differentPasswords ? "Senhas não conferem" : "Senha de confirmação não informada"}
                  />

                  <button 
                    className="change-password-button" 
                    type="submit"
                    disabled={buttonSubmitDisabled}
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <Success 
          title="Senha redefinida!"
          description="Agora você pode acessar a plataforma Happy usando sua nova senha."
          textButton="Voltar ao login"
          routeButton="/login"
        />
      )}
    </>
  );
}

export default ChangePassword;