import React from 'react';
import Navigation from '../Navigation/Navigation';
import Logo from '../Logo/Logo';
import './Header.css';

const Header = ({ isSignedIn, onRouteChange, name, entries }) => {
  return (
    <div className="db w-100 header-container">
        <Logo />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
    </div>
  );
}

export default Header;
