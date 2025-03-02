import React from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import Navbar from './Components/Navbar';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import QuizPage from './Pages/QuizPage';
import ChallengePage from './Pages/ChallengePage';
import ProtectedRoute from './Components/ProtectedRoute';
import { theme } from './Styles/theme';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  color: ${theme.colors.text};
`;

const MainContent = styled.main`
  padding-top: 1rem;
`;

const HomePage = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <h1>Welcome to GlobeTrotter! 🌍</h1>
    <p>Test your geography knowledge with our fun quiz game.</p>
    <p>Login to start playing and challenge your friends!</p>
  </div>
);

const Layout = () => (
  <AppContainer>
    <Navbar />
    <MainContent>
      <Outlet />
    </MainContent>
  </AppContainer>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/play"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenge/:inviteLink"
        element={
          <ProtectedRoute>
            <ChallengePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <div>Leaderboard Coming Soon!</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <div>My Challenges Coming Soon!</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div>Profile Coming Soon!</div>
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

const App = observer(() => {
  return <RouterProvider router={router} />;
});

export default App;