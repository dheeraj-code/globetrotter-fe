import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { theme } from '../Styles/theme';
import Button from '../Osborn/base/Button';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background: ${theme.colors.cardBg};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.medium};
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const Message = styled.p`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.lg};
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: center;
`;

const ConfirmationPopup = ({ 
  isOpen, 
  onContinue, 
  onEnd,
  title = "Leave Quiz?",
  message = "Your progress will be saved. Do you want to continue the quiz or end it and see your results?"
}) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <PopupContainer>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonContainer>
          <Button
            variant="primary"
            onClick={onContinue}
          >
            Continue Quiz
          </Button>
          <Button
            variant="error"
            onClick={onEnd}
          >
            End & See Results
          </Button>
        </ButtonContainer>
      </PopupContainer>
    </Overlay>
  );
};

ConfirmationPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onContinue: PropTypes.func.isRequired,
  onEnd: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string
};

export default ConfirmationPopup; 