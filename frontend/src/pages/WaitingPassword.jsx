import React from 'react';
import '../styles/Registration.css';
import ItWorkSidebar from '../components/ItWorkSidebar';

export const ChangePassword = () => {
  return (
    <div className="registration-page">
      <div className="registration registration_small">
          <div className="registration__message">
            <p className="additional-message secondary-text all-devices-text">Письмо для восстановления пароля было отправлено на указанную почту</p>
          </div>
      </div>
      <ItWorkSidebar/>
    </div>
  );
};

export default ChangePassword;
