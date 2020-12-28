import React, { FormEvent, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import useForm from '../../hooks/useForm';

import Input from '../../components/Input';
import Logo from '../../components/Logo';
import Success from '../../components/Success';

import './styles.css';

function ForgotPassword() {

  const initialFields = {
    email: ''
  }
  
  const [
    form, errors,
    updateField, validateFields,
    hasOneFieldEmpty,
  ] = useForm(initialFields);
  
  const [buttonSubmitDisabled, setButtonSubmitDisabled] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // eslint-disable-next-line
  const regexValidateEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/;

  useEffect(() => {
    const hasEmailValid = regexValidateEmail.test(form.email);

    if (!hasEmailValid || hasOneFieldEmpty()) {
      setButtonSubmitDisabled(true);
    }

    else {
      setButtonSubmitDisabled(false);
    }
  }, [form, hasOneFieldEmpty, regexValidateEmail]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    validateFields();

    if (hasOneFieldEmpty()) {
      return;
    }

    const data = {
      email: form.email
    }

    api.post('/forgot-password', data)
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

  return (
    <>
      { !isSuccess ? (
        <div id="page-forgot-password">
          <ToastContainer />
          <header>
            <Logo />
          </header>
          <main>
            <div className="forgot-password-content">
              <div className="header">
                <Link to="/login">
                  <FiArrowLeft size={24} strokeWidth={3} color="#15C3D6" />
                </Link>
              </div>
              <div className="body">
                <div>
                  <h1>Esqueci a senha</h1>
                  <p>Sua redefinição de senha será enviada para o e-mail cadastrado.</p>
                </div>
                <form onSubmit={handleSubmit} method="POST">
                  <Input
                    name="email"
                    type="email"
                    label="E-mail"
                    value={form.email}
                    onChange={updateField}
                    labelError="E-mail não informado"
                    error={errors.email}
                  />

                  <button 
                    className="forgot-password-button" 
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
          title="Redefinição enviada!"
          description="Boa, agora é só checar o e-mail que foi enviado para você redefinir sua senha."
          textButton="Voltar ao login"
          routeButton="/login"
        />
      )}
    </>
  );
}

export default ForgotPassword;