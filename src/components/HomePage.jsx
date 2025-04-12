import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Navigation from './Navigation';

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Token expired
        Cookies.remove('authToken');
        Cookies.remove('userLogin');
        navigate('/');
      }
    } catch (error) {
      // Invalid token
      Cookies.remove('authToken');
      Cookies.remove('userLogin');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{ padding: '20px' }}>
      <Navigation />
      <div className="home-page" style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1>Добро пожаловать!</h1>
        <p>Вы успешно вошли в систему.</p>
      </div>
    </div>
  );
}

export default HomePage; 

