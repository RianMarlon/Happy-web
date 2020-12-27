import React, { FormEvent, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import useForm from '../../hooks/useForm';

import Input from '../../components/Input';
import InputPassword from '../../components/InputPassword';
import Logo from '../../components/Logo';
import Success from '../../components/Success';

import './styles.css';

function Register() {

  const initialFields = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  
  const [
    form, errors,
    updateField, validateFields,
    hasOneFieldEmpty,
  ] = useForm(initialFields);
  
  const [buttonSubmitDisabled, setButtonSubmitDisabled] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const [differentPasswords, setDifferentPasswords] = useState(false);

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

  useEffect(() => {
    setDifferentPasswords(false);
  }, [form.confirmPassword]);

  function handleSubmitRegister(e: FormEvent) {
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
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      password: form.password,
      confirm_password: form.confirmPassword
    }

    api.post('/signup', data)
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
        <div id="page-register">
          <ToastContainer />
          <header>
            <Logo />
          </header>
          <main>
            <div className="register-content">
              <div className="header">
                <Link to="/login">
                  <FiArrowLeft size={24} strokeWidth={3} color="#15C3D6" />
                </Link>
              </div>
              <div className="body">
                <div>
                  <h1>Cadastro</h1>
                  <p>Preencha os dados abaixo para começar</p>
                </div>
                <form onSubmit={handleSubmitRegister} method="POST">
                  <Input
                    name="firstName"
                    label="Nome"
                    value={form.firstName}
                    onChange={updateField}
                    labelError="Nome não informado"
                    error={errors.firstName}
                  />

                  <Input
                    name="lastName"
                    label="Sobrenome"
                    value={form.lastName}
                    onChange={updateField}
                    labelError="Sobrenome não informado"
                    error={errors.lastName}
                  />

                  <Input
                    name="email"
                    type="email"
                    label="E-mail"
                    value={form.email}
                    onChange={updateField}
                    labelError="E-mail não informado"
                    error={errors.email}
                  />

                  <InputPassword
                    name="password"
                    label="Senha"
                    value={form.password}
                    onChange={updateField}   
                    labelError="Senha não informada"
                    error={errors.password}
                  />

                  <InputPassword
                    name="confirmPassword"
                    label="Confirme sua senha"
                    value={form.confirmPassword}
                    error={errors.confirmPassword || differentPasswords}
                    onChange={updateField}
                    labelError={differentPasswords ? "Senhas não conferem" : "Senha de confirmação não informada"}
                  />

                  <button 
                    className="register-button" 
                    type="submit"
                    disabled={buttonSubmitDisabled}
                  >
                    Cadastrar
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <Success 
          title="Cadastro concluído!"
          description="Agora você precisa acessar seu e-mail e confirmá-lo através de um e-mail que enviamos."
          textButton="Voltar ao login"
          routeButton="/login"
        />
      )}
    </>
  );
}

export default Register;