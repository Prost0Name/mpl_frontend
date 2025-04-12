import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Drawer, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Navigation() {
  const navigate = useNavigate();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setMobile] = useState(false);
  const [userLogin, setUserLogin] = useState(null);

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const login = Cookies.get('userLogin');
    setUserLogin(login);
  }, []);

  const handleLogout = () => {
    // Удаляем cookies при выходе
    Cookies.remove('authToken');
    Cookies.remove('userLogin');
    setUserLogin(null);
    navigate('/');
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 600);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AppBar position="static" style={{ backgroundColor: '#B0BEC5', borderRadius: '8px' }} elevation={0}>
      <Toolbar>
        {isMobile ? (
          <>
            <Button onClick={toggleDrawer(true)} style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
              Меню
            </Button>
            <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
              <div style={{ width: 250, display: 'flex', flexDirection: 'column', padding: '10px' }}>
                <Button onClick={() => { navigate('/'); setDrawerOpen(false); }} style={{ color: '#000', marginBottom: '10px' }}>Главная</Button>
                <Button onClick={() => { navigate('/gallery'); setDrawerOpen(false); }} style={{ color: '#000' }}>Изображения</Button>
              </div>
            </Drawer>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={() => navigate('/')} style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Главная</Button>
            <Button onClick={() => navigate('/gallery')} style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Изображения</Button>
          </div>
        )}
        
        {userLogin ? (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <Typography style={{ color: '#FFFFFF', fontWeight: 'bold', marginRight: '10px' }}>
              {userLogin}
            </Typography>
            <Button 
              color="inherit" 
              onClick={handleLogout} 
              style={{ color: '#FFFFFF', fontWeight: 'bold' }}
            >
              Выйти
            </Button>
          </div>
        ) : (
          <Button 
            color="inherit" 
            onClick={() => navigate('/enter')} 
            style={{ marginLeft: 'auto', color: '#FFFFFF', fontWeight: 'bold' }}
          >
            Войти
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navigation; 