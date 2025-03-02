import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useStores } from '../Stores';
import { theme } from '../Styles/theme';
import Button from '../Osborn/base/Button';

const NavbarContainer = styled.nav`
  background: ${theme.colors.primary};
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${theme.colors.text};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${theme.colors.accent};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

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

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Navbar = observer(() => {
  const navigate = useNavigate();
  const { authStore } = useStores();

  const handleLogout = async () => {
    await authStore.logout();
    navigate('/');
  };

  return (
    <NavbarContainer>
      <Logo to="/">
        🌍 GlobeTrotter
      </Logo>

      <NavLinks>
        {authStore.isAuthenticated ? (
          <NavLink to="/play">Play Quiz</NavLink>
        ) : (
          <NavLink to="/play">Start Playing</NavLink>
        )}
      </NavLinks>

      <AuthButtons>
        {authStore.isAuthenticated ? (
          <Button
            variant="accent"
            size="small"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="accent"
              size="small"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </Button>
          </>
        )}
      </AuthButtons>
    </NavbarContainer>
  );
});

export default Navbar; 