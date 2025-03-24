import React from 'react';
import "../style.scss";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;