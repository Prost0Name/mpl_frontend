import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

function ConfirmationPage() {
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(10);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get('status');

    switch (status) {
      case 'success':
        setMessage('Регистрация успешно подтверждена');
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      case 'token_invalid':
        setMessage('Время на подтверждение вышло или токен недействителен');
        break;
      case 'unknown_error':
        setMessage('Неизвестная ошибка');
        break;
      default:
        setMessage('Неизвестный статус');
        break;
    }
  }, [location, navigate]);

  return (
    <div style={{ padding: '20px' }}>
      <Navigation />
      <Container maxWidth="xs">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
            {message}
          </Typography>
          {message === 'Регистрация успешно подтверждена' && (
            <Typography sx={{ mt: 2, fontSize: '1.2rem', fontWeight: 'medium' }}>
              Вы будете перенаправлены на главную страницу через {countdown} секунд.
            </Typography>
          )}
        </Box>
      </Container>
    </div>
  );
}

export default ConfirmationPage;
