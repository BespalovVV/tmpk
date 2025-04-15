import React from 'react';
import '../styles/Layout.css';

export const Layout = ({children}) => {
  return (
    <div className="main-wrapper">
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout;