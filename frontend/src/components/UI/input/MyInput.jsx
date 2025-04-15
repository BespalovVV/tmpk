import React from 'react';
import './MyInput.css';

const MyInput = React.forwardRef(({ label,  className = "", ...props }, ref) => {
  return (
    <div className={`my-input ${className}`}>
      {label && <label>{label}</label>}
      <input ref={ref} {...props} />
    </div>
  );
});

export default MyInput;
