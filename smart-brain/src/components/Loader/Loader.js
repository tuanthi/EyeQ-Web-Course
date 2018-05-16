import React from 'react';
import './Loader.css';

const Loader = ({isActive}) => {
    if (!isActive) return '';
  return (
      <div className="app-load-container">
          <div className="app-load-thecube">
              <div className="app-load-cube app-load-c1"></div>
              <div className="app-load-cube app-load-c2"></div>
              <div className="app-load-cube app-load-c4"></div>
              <div className="app-load-cube app-load-c3"></div>
          </div>
      </div>
  );
}

export default Loader;
