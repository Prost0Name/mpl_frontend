import React, { useState } from 'react';
import { TextField, Container, Box, Typography, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

function RegisterPage() {
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    if (!formData.login || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage("Все поля обязательны для заполнения");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch('https://api.vsrs-rs.ru/reg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: formData.login,
          email: formData.email,
          password: formData.password
        })
      });
      
      if (response.ok) {
        navigate('/enter'); 
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
            Регистрация
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
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Подтвердите пароль"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Зарегистрироваться
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default RegisterPage; 