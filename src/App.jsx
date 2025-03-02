import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import GamePage from './Pages/GamePage';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  console.log('App rendering');
  
  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;