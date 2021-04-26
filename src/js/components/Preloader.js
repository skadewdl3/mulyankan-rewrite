import React from 'react';

const Preloader = ({ accent, scale }) => {
  return (
    <div
      className="preloader__wrapper"
      style={{ transform: `scale(${scale})` }}
    >
      <div className={`preloader ${accent ? 'preloader--accent' : ''}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Preloader;
