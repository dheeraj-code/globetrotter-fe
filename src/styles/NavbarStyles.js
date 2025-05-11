import styled from "styled-components";
import { theme } from "./theme";
import { Link } from "react-router-dom";

export const NavbarContainer = styled.nav`
  /* background: ${theme.colors.secondary}; */
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
`;

export const Logo = styled(Link)`
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

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

export const NavLink = styled(Link)`
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

export const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;
