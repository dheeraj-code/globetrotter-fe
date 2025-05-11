import styled from "styled-components";
import { theme } from "./theme";

export const PageContainer = styled.div`
  min-height: 90vh;
  width: 100%;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm};
  background-image: linear-gradient(to right, #edf5f7, #eaf0f5, #e9ecf2, #e9e7ed, #e8e2e7);
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const Label = styled.label`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.xs};
`;

export const RegisterLink = styled.a`
  color: ${theme.colors.accent};
  text-decoration: none;
  text-align: center;
  margin-top: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.xs};

  &:hover {
    text-decoration: underline;
  }
`;
