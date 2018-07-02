import React from 'react';
import Navigation from './Navigation/Navigation';
import Logo from './Logo/Logo';
import './Header.css';

const Header = ({ isSignedIn, onRouteChange, userinfo }) => {
    // <Navigation
    //     isSignedIn={isSignedIn}
    //     onRouteChange={onRouteChange}
    //     userinfo={userinfo}
    // />
  return (
    <div className="db w-100 header-container">
        <Logo />

    </div>
  );
}

export default Header;
