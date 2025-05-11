import styled from "styled-components";
import { theme } from "./theme";

export const PageContainer = styled.div`
  min-height: 90vh;
  width: 100%;
  color: ${theme.colors.text};
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background-image: linear-gradient(to right, #edf5f7, #eaf0f5, #e9ecf2, #e9e7ed, #e8e2e7);
`;

export const GameContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 20px 20px 20px;
  /* justify-content: center; */
  /* padding: ${theme.spacing.sm}; */
`;

export const LoadingText = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  margin-top: 1.2rem;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

export const ErrorMessage = styled.div`
  color: ${theme.colors.text};
  padding: 2rem;
  text-align: center;
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  margin: 2rem 0;
  border: 1px solid ${theme.colors.error};
  max-width: 600px;
  width: 100%;
`;

export const GlobalTitle = styled.h1`
  font-size: 2.5rem;
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
`;
