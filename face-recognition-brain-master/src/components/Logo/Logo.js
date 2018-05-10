import React from 'react';
import Tilt from 'react-tilt';
import brain from './eyeq-logo-white.png';
import './Logo.css';

const Logo = () => {
  return (
    <div className='ml4 fl'>
      <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} >
        <div className="Tilt-inner pa1 mt1">
          <img style={{paddingTop: '5px'}} alt='logo' src={brain}/>
        </div>
      </Tilt>
    </div>
  );
}

export default Logo;
