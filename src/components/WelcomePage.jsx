import React from 'react';
import Navigation from './Navigation';

function WelcomePage() {
  return (
    <div style={{ padding: '20px' }}>
      <Navigation />
      <div style={{ textAlign: 'center', marginTop: '20px', color: '#2C3E50' }}>
        <h1 style={{ color: '#2C3E50' }}>Добро пожаловать в наше приложение!</h1>
        <p style={{ color: '#34495E' }}>Пожалуйста, перейдите на страницу входа, чтобы продолжить.</p>
      </div>
    </div>
  );
}

export default WelcomePage; 