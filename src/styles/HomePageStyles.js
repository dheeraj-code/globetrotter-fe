import styled from 'styled-components';
import { theme } from './theme';

export const PageContainer = styled.div`
  min-height: 90vh;
  width: 100%;
  background-color: ${theme.colors.background};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  background-image: linear-gradient(to right, #edf5f7, #eaf0f5, #e9ecf2, #e9e7ed, #e8e2e7);
`;

export const GlobalTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  color: ${theme.colors.accent};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
`;

export const WelcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.1); /* Transparent background */
  padding: 3rem;
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.card};
  max-width: 1000px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: ${theme.spacing.xl};
`;

export const Title = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text};
  font-weight: ${theme.typography.fontWeight.bold};
  letter-spacing: -0.5px;
  line-height: ${theme.typography.lineHeight.tight};
  
  @media (max-width: 768px) {
    font-size: ${theme.typography.fontSize['2xl']};
  }
`;

export const Subtitle = styled.h2`
  color: ${theme.colors.accent};
  font-size: ${theme.typography.fontSize.lg};
  margin-bottom: ${theme.spacing.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  line-height: ${theme.typography.lineHeight.normal};
  
  @media (max-width: 768px) {
    font-size: ${theme.typography.fontSize.md};
  }
`;

export const Description = styled.p`
  color: ${theme.colors.text};
  font-size: ${theme.typography.fontSize.md};
  margin-bottom: ${theme.spacing.lg};
  line-height: ${theme.typography.lineHeight.relaxed};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: ${theme.typography.fontSize.sm};
  }
`;

export const GameStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 3rem 0;
  flex-wrap: wrap;
`;

export const StatItem = styled.div`
  text-align: center;

  .value {
    font-size: ${theme.typography.fontSize['2xl']};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.accent};
    margin-bottom: ${theme.spacing.xs};
    line-height: ${theme.typography.lineHeight.tight};
  }

  .label {
    color: ${theme.colors.text};
    font-size: ${theme.typography.fontSize.xs};
    line-height: ${theme.typography.lineHeight.normal};
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1); /* Transparent background */
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  text-align: center;
  transition: ${theme.transitions.default};
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.hover};
  }

  h3 {
    color: ${theme.colors.accent};
    margin-bottom: ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.md};
    font-weight: ${theme.typography.fontWeight.semibold};
    line-height: ${theme.typography.lineHeight.normal};
  }

  p {
    color: ${theme.colors.text};
    font-size: ${theme.typography.fontSize.sm};
    line-height: ${theme.typography.lineHeight.relaxed};
  }
`;

export const PlayButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.xl};
  font-size: ${theme.typography.fontSize.lg};
  background: ${theme.colors.accent};
  color: ${theme.colors.text};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.button};
  font-weight: ${theme.typography.fontWeight.semibold};
  letter-spacing: 0.5px;
  margin-top: ${theme.spacing.md};

  &:hover {
    transform: translateY(-3px);
    background: ${theme.colors.buttonHover};
    box-shadow: ${theme.shadows.hover};
  }
`;
