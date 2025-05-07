import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Registration.css';
import '../styles/SignUpSuccess.css';
import api from "../API/axiosInstance";
import ItWorkSidebar from '../components/ItWorkSidebar';
import MyButton from '../components/UI/button/MyButton';
import MyInput from '../components/UI/input/MyInput';
import { HiOutlinePencil  } from 'react-icons/hi';

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
    
    const handleRedirect = () => {
        navigate('/contact-support');
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
            if (error.response?.status === 500) {
                setMessage({
                    text: 'Этот email уже зарегистрирован.',
                    isError: true
                });
            } else if (error.response?.status === 422) {
                setMessage({
                    text: 'Этот email уже зарегистрирован.',
                    isError: true
                });
            } else {
                setMessage({
                    text: error.response?.data?.message || error.message || 'Ошибка при изменении email',
                    isError: true
                });
            }
        } finally {
            setIsLoading(false);
        }
    };
    

    const validateEmail = (email) => {
        const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return re.test(email);
    };

    return (
        <div className="confirmation-message-container registration-page">
            <div className="confirmation-card registration__message">
                <p className="main-message">Подтвердите ваш email</p>
                {isEditing ? (
                    <div className="email-edit-container">
                        <div className="email-input">
                            <MyInput
                                type="email"
                                value={new_email}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Введите новый email"
                                className="email-input change-email-input"
                            />
                        </div>
                        <div className="email-edit-buttons">
                            <MyButton
                                onClick={handleUpdateEmail}
                                disabled={isLoading}
                                className="save-button secondary-button"
                            >
                                {isLoading ? 'Сохранение...' : 'Сохранить'}
                            </MyButton>
                            <MyButton
                                onClick={() => {
                                    setIsEditing(false);
                                    setNewEmail(email);
                                    setMessage({ text: '', isError: false});
                                }}
                                className="cancel-button secondary-button"
                            >
                                Отмена
                            </MyButton>
                        </div>
                    </div>
                ) : (
                    <p className="additional-text">
                        Мы отправили письмо с подтверждением на адрес <strong>{email}</strong>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="main-icon"
                        >
                            <HiOutlinePencil size={16}/>
                        </button>
                    </p>
                )}

                <div>
                    <p className="secondary-text">
                        Если письмо не пришло, проверьте папку "Спам" или запросите повторную отправку.
                    </p>

                    <MyButton
                        onClick={handleResendEmail}
                        disabled={isLoading || isEditing}
                        className="resend-button auth"
                    >
                        {isLoading ? 'Отправка...' : 'Отправить письмо повторно'}
                    </MyButton>
                </div>

                {message.text && (
                    <p style={{ color: 'red' }} className={`message ${message.isError ? 'error' : 'success'}`}>
                        {message.text}
                    </p>
                ) }

                <div className="to-support">
                    <span className="secondary-text">Возникли проблемы?</span> 
                    <MyButton className="secondary-button auth" type="button" onClick={handleRedirect}>Свяжитесь с поддержкой</MyButton>
                </div>
            </div>
            <ItWorkSidebar />
        </div>
    );
};

export default EmailConfirmationMessage;