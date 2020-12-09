import React, { TextareaHTMLAttributes, useState, useEffect } from 'react';

import './styles.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  labelError: string;
  error: boolean;
  comment: string;
}

function Textarea({ label, labelError, error, comment, ...rest }: TextareaProps) {

  const labelClassName = error ? 'error' : '';

  const [textareaClassName, setTextareaClassName] = useState('textarea');
  
  useEffect(() => {
    if (rest.value && rest.value.toString().trim()) {
      setTextareaClassName('textarea no-empty');
    }

    else if (error) {
      setTextareaClassName('textarea textarea-error');
    }

    else {
      setTextareaClassName('textarea');
    }
  }, [rest.value, error]);

  return (
    <div className="textarea-block">
      <label className={labelClassName} htmlFor={rest.name}>
        <span>
          {
            error ? labelError : label
          }
        </span>
        <span className="comment">
          {
            !error && comment
          }
        </span>
      </label>
      <textarea className={textareaClassName} { ...rest } />
    </div>
  );
}

export default Textarea;
