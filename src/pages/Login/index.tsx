import React, { FormEvent, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import useForm from '../../hooks/useForm';

import Input from '../../components/Input';
import InputPassword from '../../components/InputPassword';
import Logo from '../../components/Logo';

import './styles.css';

function Login() {

  const initialFields = {
    email: '',
    password: ''
  }
  
  const [
    form, errors,
    updateField, validateFields,
    hasOneFieldEmpty,
  ] = useForm(initialFields);
  
  const [rememberMe, setRememberMe] = useState(false);
  const [buttonSubmitDisabled, setButtonSubmitDisabled] = useState(true);

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

  function handleSubmitLogin(e: FormEvent) {
    e.preventDefault();

    validateFields();

    if (hasOneFieldEmpty()) {
      return;
    }

    const data = {
      email: form.email,
      password: form.password,
      remember_me: rememberMe
    }

    api.post('/signin', data)
      .then(async (response) => {
        const { token } = response.data;

        console.log(token);
      })
      .catch(({ response }) => {
        const data = response.data;
        const messageError = data.messagesError[0];
        
        toast.error(messageError, {
          autoClose: 5000
        });
      });
  }

  return(
    <div id="page-login">
      <ToastContainer />

      <header>
        <Logo />
      </header>
      <main>
        <div className="login-content">
          <h1>Fazer login</h1>
          <form onSubmit={handleSubmitLogin} method="POST">
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

            <div className="extras-block">
              <label className="remember-me-block">
                <input type="checkbox" name="rememberMe" id="remember-me"
                  defaultChecked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />

                <div className="checkbox-container" />

                <p>Lembrar-me</p>
              </label>

              <Link to="/forgot-password">
                Esqueci minha senha
              </Link>
            </div>

            <button 
              className="confirm-button" 
              type="submit"
              disabled={buttonSubmitDisabled}
            >
              Entrar
            </button>
          </form>

          <div className="footer">
            <div>
              <p>
                Não nem conta?
              </p>
              <Link to="/register">Cadastre-se</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;