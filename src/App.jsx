import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Components/Navbar";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import QuizPage from "./Pages/QuizPage";
import ChallengePage from "./Pages/ChallengePage";
import ProtectedRoute from "./Components/ProtectedRoute";
import { theme } from "./styles/theme";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Button } from "antd";

const { Title, Text } = Typography;

const NavLink = styled(Link)`
  color: ${theme.colors.text};
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: ${theme.borderRadius.small};
  transition: all 0.2s ease;

  &:hover {
    color: ${theme.colors.accent};
    background: ${theme.colors.cardBg};
  }

  &.active {
    color: ${theme.colors.accent};
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  background-image: linear-gradient(to right, #edf5f7, #eaf0f5, #e9ecf2, #e9e7ed, #e8e2e7);
`;

const MainContent = styled.main`
  padding-top: 1rem;
`;

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartPlaying = () => {
    navigate("/play");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        flexDirection: "column",
        textAlign: "center",
        padding: "2rem",
        height: "100%",
      }}
    >
      <Title level={1}>Welcome to GlobeTrotter!</Title>
      <Text>Explore the world and test your geography knowledge with our interactive quiz game.</Text>
      <Text>Sign in to start your journey and challenge your friends to see who knows more!</Text>
      <Button
        type="primary"
        size="large"
        onClick={handleStartPlaying}
        style={{ maxWidth: "200px", margin: "0 auto" }}
      >
        Start Playing
      </Button>
    </div>
  );
};

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

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
