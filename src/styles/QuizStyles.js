import styled from "styled-components";
import { theme } from "./theme";

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

export const FeedbackSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing.md};
  align-items: center;
  justify-content: space-between;
`;

export const FunFactContainer = styled.div`
  margin-top: ${theme.spacing.xs};
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.cardBg};
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${theme.colors.accent}40;

  h3 {
    color: ${theme.colors.accent};
    font-size: ${theme.typography.fontSize.md};
    margin-bottom: ${theme.spacing.xs};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
  }

  p {
    color: ${theme.colors.textSecondary};
    font-size: ${theme.typography.fontSize.sm};
    line-height: ${theme.typography.lineHeight.relaxed};
    margin: 0;
  }
`;
