import React, { useState } from 'react';
import { TextField, Container, Box, Typography, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navigation from './Navigation';

function LoginPage() {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://api.vsrs-rs.ru/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        Cookies.set('authToken', data.token, { expires: 7 });
        Cookies.set('userLogin', formData.login, { expires: 7 });
        navigate('/home');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Navigation />
      <Container maxWidth="xs">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Вход
          </Typography>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Логин"
              name="login"
              autoComplete="login"
              autoFocus
              value={formData.login}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Войти
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/register')}
            >
              Регистрация
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default LoginPage; 