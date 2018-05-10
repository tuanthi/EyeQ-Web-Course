import React from 'react';
import './Navigation.css';

const Navigation = ({ onRouteChange, isSignedIn }) => {
    if (isSignedIn) {
      return (
        <nav style={{marginRight:'20px', display: 'flex', justifyContent: 'flex-end'}}>
          <p onClick={() => onRouteChange('signout')} className='nav-menu-txt f4 ma2 link dim mid-gray b pa2 pointer'>Sign Out</p>
        </nav>
      );
    } else {
      return (
        <nav style={{marginRight:'20px', display: 'flex', justifyContent: 'flex-end'}}>
          <p onClick={() => onRouteChange('signin')} className='nav-menu-txt f4 ma2 link dim mid-gray b pa2 pointer'>Sign In</p>
          <p onClick={() => onRouteChange('register')} className='nav-menu-txt f4 ma2 link dim mid-gray b pa2 pointer'>Register</p>
        </nav>
      );
    }
}

export default Navigation;
