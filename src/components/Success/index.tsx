import React from 'react';
import { Link } from 'react-router-dom';

import successImg from '../../assets/images/success.svg';

import './styles.css';



interface SuccessProps {
  title: string;
  description: string;
  textButton: string;
  routeButton: string;
}

function Success({ title, description, textButton, routeButton }: SuccessProps) {
  return (
    <main id="component-success">
      <div className="image-container">
        <img src={successImg} alt="" />
      </div>

      <div className="content-container">
        <div>
          <h1>{ title }</h1>
          <p>
            { description }
          </p>

          <Link to={routeButton}>
            { textButton }
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Success;
