import React, { useState, useEffect } from 'react';

import { InputProps } from '../Input';

import eyeImg from '../../assets/images/eye.svg';
import eyeOffImg from '../../assets/images/eye-off.svg';

import './styles.css';

interface InputPasswordProps extends InputProps {};

function InputPassword({ name, label, labelError, error, value, onChange }: InputPasswordProps) {

  const [showPassword, setShowPassword] = useState(false);
  const [typeInput, setTypeInput] = useState('password');

  const labelClassName = error ? 'error' : '';

  const [inputClassName, setInputClassName] = useState('input-password');

  useEffect(() => {
    if(showPassword) {
      setTypeInput('text');
    }

    else {
      setTypeInput('password');
    }
  }, [showPassword]);
  
  useEffect(() => {
    if (value && value.toString().trim()) {
      setInputClassName('input-password no-empty');
    }

    else if (error) {
      setInputClassName('input-password input-error');
    }

    else {
      setInputClassName('input-password');
    }
  }, [value, error]);

  return (
    <div className="input-block">
      <label className={labelClassName} htmlFor={name}>
        {
          error ? labelError : label
        }
      </label>
      <div className="input-password-container">
        <input className={inputClassName} 
          name={name} type={typeInput} 
          value={value} onChange={onChange}
        />

        <div className="button-container">
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {
              showPassword
              ? <img src={eyeOffImg} alt="" />
              : <img src={eyeImg} alt="" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputPassword;
