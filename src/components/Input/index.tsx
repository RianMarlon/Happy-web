import React, { InputHTMLAttributes, useState, useEffect } from 'react';

import './styles.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelError: string;
  error: boolean;
}

function Input({ label, labelError, error, ...rest }: InputProps) {

  const labelClassName = error ? 'error' : '';

  const [inputClassName, setInputClassName] = useState('input');
  
  useEffect(() => {
    if (rest.value && rest.value.toString().trim()) {
      setInputClassName('input no-empty');
    }

    else if (error) {
      setInputClassName('input input-error');
    }

    else {
      setInputClassName('input');
    }
  }, [rest.value, error]);

  return (
    <div className="input-block">
      <label className={labelClassName} htmlFor={rest.name}>
        {
          error ? labelError : label
        }
      </label>
      <input className={inputClassName} { ...rest } />
    </div>
  );
}

export default Input;
