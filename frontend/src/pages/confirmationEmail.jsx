import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/EmailConfirmationMessage.css';
import api from "../API/axiosInstance";

const EmailConfirmationMessage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || 'вашу почту';
    
    useEffect(() => {
        if (!location.state?.email) {
            navigate('/register');
        }
    }, [location.state, navigate]);

    const handleResendEmail = async () => {
        try {
            await api.post('send-confirmation-email', { "email": location.state.email, });
            alert('Письмо с подтверждением отправлено повторно!');
        } catch (error) {
            alert('Ошибка при отправке письма. Попробуйте позже.');
        }
    };

    return (
        <div className="confirmation-message-container">
            <div className="confirmation-card">
                <h2>Подтвердите ваш email</h2>
                <div className="icon-container">
                    <svg /* Иконка письма */ >...</svg>
                </div>
                <p>
                    Мы отправили письмо с подтверждением на адрес <strong>{email}</strong>.
                    Пожалуйста, проверьте вашу почту и перейдите по ссылке в письме.
                </p>
                <p className="secondary-text">
                    Если письмо не пришло, проверьте папку "Спам" или запросите повторную отправку.
                </p>
                <button
                    onClick={handleResendEmail}
                    className="resend-button"
                >
                    Отправить письмо повторно
                </button>
                <p className="support-text">
                    Возникли проблемы? <a href="/contact-support">Свяжитесь с поддержкой</a>
                </p>
            </div>
        </div>
    );
};

export default EmailConfirmationMessage;