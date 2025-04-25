import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/EmailConfirmationMessage.css';
import api from "../API/axiosInstance";

const EmailConfirmationMessage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(location.state?.email || '');
    const [isEditing, setIsEditing] = useState(false);
    const [new_email, setNewEmail] = useState(location.state?.email || '');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', isError: false });

    useEffect(() => {
        if (!location.state?.email) {
            navigate('/register');
        }
    }, [location.state, navigate]);

    const handleResendEmail = async () => {
        try {
            setIsLoading(true);
            await api.post('send-confirmation-email', {"email": location.state.email});
            setMessage({ text: 'Письмо с подтверждением отправлено повторно!', isError: false });
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Ошибка при отправке письма. Попробуйте позже.',
                isError: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!new_email || !validateEmail(new_email)) {
            setMessage({ text: 'Введите корректный email', isError: true });
            return;
        }

        try {
            setIsLoading(true);
            setMessage({ text: '', isError: false });

            const response = await api.put('update-email', {
                old_email: email,
                new_email
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Не удалось изменить email');
            }

            const updatedEmail = new_email;

            setEmail(updatedEmail);
            location.state.email = updatedEmail;
            setIsEditing(false);

            setMessage({
                text: 'Email успешно изменён. Отправляем новое письмо подтверждения...',
                isError: false
            });

            await handleResendEmail();

        } catch (error) {
            setMessage({
                text: error.response?.data?.message ||
                    error.message ||
                    'Ошибка при изменении email',
                isError: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    return (
        <div className="confirmation-message-container">
            <div className="confirmation-card">
                <h2>Подтвердите ваш email</h2>

                <div className="icon-container">
                    <svg /* Иконка письма */ >...</svg>
                </div>

                {isEditing ? (
                    <div className="email-edit-container">
                        <input
                            type="email"
                            value={new_email}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Введите новый email"
                            className="email-input"
                        />
                        <div className="email-edit-buttons">
                            <button
                                onClick={handleUpdateEmail}
                                disabled={isLoading}
                                className="save-button"
                            >
                                {isLoading ? 'Сохранение...' : 'Сохранить'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setNewEmail(email);
                                    setMessage({ text: '', isError: false });
                                }}
                                className="cancel-button"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>
                        Мы отправили письмо с подтверждением на адрес <strong>{email}</strong>.
                        <button
                            onClick={() => setIsEditing(true)}
                            className="action-buttons"
                        >
                            Изменить
                        </button>
                    </p>
                )}

                <p className="secondary-text">
                    Если письмо не пришло, проверьте папку "Спам" или запросите повторную отправку.
                </p>

                <div className="action-buttons">
                    <button
                        onClick={handleResendEmail}
                        disabled={isLoading || isEditing}
                        className="resend-button"
                    >
                        {isLoading ? 'Отправка...' : 'Отправить письмо повторно'}
                    </button>
                </div>

                {message.text && (
                    <p className={`message ${message.isError ? 'error' : 'success'}`}>
                        {message.text}
                    </p>
                )}

                <p className="support-text">
                    Возникли проблемы? <a href="/contact-support">Свяжитесь с поддержкой</a>
                </p>
            </div>
        </div>
    );
};

export default EmailConfirmationMessage;