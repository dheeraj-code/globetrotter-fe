import styled from "styled-components";
import { theme } from "./theme";

export const ResultsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing.sm};
`;

export const ResultsCard = styled.div`
  background: rgba(255, 255, 255, 0.1); /* Transparent background */
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.medium};
  /* box-shadow: ${theme.shadows.card}; */
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

export const ScoreText = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
`;

export const ScorePercentage = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${props => {
    const percentage = (props.$score / props.$total) * 100;
    if (percentage >= 80) return theme.colors.success;
    if (percentage >= 60) return theme.colors.accent;
    return theme.colors.error;
  }};
  margin: ${theme.spacing.lg} 0;
`;

export const MessageContainer = styled.div`
  margin: ${theme.spacing.lg} 0;
`;

export const Message = styled.p`
  color: ${theme.colors.text};
  font-size: ${theme.typography.fontSize.md};
  margin: ${theme.spacing.xs} 0;
  line-height: ${theme.typography.lineHeight.relaxed};
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
`;

export const ChallengeInfo = styled.div`
  background: rgba(255, 255, 255, 0.1); /* Transparent background */
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.md};
  margin: ${theme.spacing.sm} 0;
  border: 1px solid ${theme.colors.accent}40;

  h3 {
    color: ${theme.colors.accent};
    font-size: ${theme.typography.fontSize.lg};
    margin-bottom: ${theme.spacing.sm};
  }

  p {
    font-size: ${theme.typography.fontSize.md};
    color: ${theme.colors.text};
  }
`;

export const ShareLink = styled.div`
  background: rgba(255, 255, 255, 0.1); /* Transparent background */
  border-radius: ${theme.borderRadius.small};
  padding: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};

  input {
    flex: 1;
    background: transparent;
    border: none;
    color: ${theme.colors.text};
    font-size: ${theme.typography.fontSize.sm};
    padding: 0.5rem;
    &:focus {
      outline: none;
    }
  }
`;
