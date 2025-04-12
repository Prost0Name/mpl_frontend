import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageGallery from './components/ImageGallery';
import './index.css';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import WelcomePage from './components/WelcomePage';
import RegisterPage from './components/RegisterPage';
import ConfirmationPage from './components/ConfirmationPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/gallery" element={<ImageGallery />} />
        <Route path="/" element={<WelcomePage />} />
        <Route path="/enter" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm" element={<ConfirmationPage />} />
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

