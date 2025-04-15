import React from 'react';
import './MyButton.css';

const MyButton = ({ children, className = "", ...props }) => {
  return (
    <button {...props} className={`my-button ${className}`}>
      {children}
    </button>
  );
};

export default MyButton;
