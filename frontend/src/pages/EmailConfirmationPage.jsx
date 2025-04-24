import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../API/axiosInstance'
const EmailConfirmationPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('pending');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await api.get(`confirm-email/${token}`);

                if (response.data.success) {
                    setStatus('success');
                    setMessage('Email успешно подтверждён!');

                    setTimeout(() => navigate('/'), 3000);
                } else {
                    setStatus('error');
                    setMessage(response.data.message || 'Ошибка подтверждения email');
                }
            } catch (error) {
                setStatus('error');
                setMessage(
                    error.response?.data?.message ||
                    'Произошла ошибка при подтверждении email. Пожалуйста, попробуйте позже.'
                );
            }
        };

        if (token) {
            confirmEmail();
        } else {
            setStatus('error');
            setMessage('Неверная ссылка подтверждения. Токен отсутствует.');
        }
    }, [token, navigate]);

    const renderContent = () => {
        switch (status) {
            case 'pending':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '60px', height: '60px', border: '4px solid #ddd', borderRadius: '50%' }} />
                        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>Подтверждение email...</div>
                    </div>
                );

            case 'success':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '60px', color: '#4caf50' }}>✓</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 600, textAlign: 'center' }}>Email подтверждён!</div>
                        <div>{message}</div>
                        <div>Вы будете перенаправлены на главную страницу...</div>
                    </div>
                );

            case 'error':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '60px', color: '#f44336' }}>✕</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 600, textAlign: 'center' }}>Ошибка подтверждения</div>
                        <div style={{ textAlign: 'center' }}>{message}</div>
                        <button
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                marginTop: '16px',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate('/')}
                        >
                            На главную
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '500px',
                width: '100%',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                textAlign: 'center'
            }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default EmailConfirmationPage;