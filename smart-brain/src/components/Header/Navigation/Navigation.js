import React from 'react';
import './Navigation.css';

const Navigation = ({ onRouteChange, isSignedIn, userinfo }) => {
    if (isSignedIn) {
      return (
        <nav style={{marginRight:'20px', display: 'flex', justifyContent: 'flex-end'}}>
            <div className="nav-greet-txt f5 ma2 b mid-gray pa2 relative">
                <p className="ma0">Howdy, {userinfo.name}</p>
                <p className="nav-lastlg-txt absolute ma0 f7 pa1 bg-mid-gray near-white br3" style={{width: '200px', left: '-50px'}}>
                    Last login: {userinfo.lastlogin}
                </p>
            </div>
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
