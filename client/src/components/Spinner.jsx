import React from 'react';
import './Spinner.css';

const Spinner = () => {
  return (
    <div className="tree-spinner-overlay">
      <div className="tree-spinner">
        <div className="tree">
          <div className="trunk"></div>
          <div className="foliage"></div>
        </div>
        <div className="tree">
          <div className="trunk"></div>
          <div className="foliage"></div>
        </div>
        <div className="tree">
          <div className="trunk"></div>
          <div className="foliage"></div>
        </div>
        <div className="tree">
          <div className="trunk"></div>
          <div className="foliage"></div>
        </div>
        <div className="tree">
          <div className="trunk"></div>
          <div className="foliage"></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;