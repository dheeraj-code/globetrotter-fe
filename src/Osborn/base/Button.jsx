import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from '../../styles/theme';

const StyledButton = styled.button`
  background: ${props => {
    if (props.$variant === 'primary') return theme.colors.primary;
    if (props.$variant === 'accent') return theme.colors.accent;
    if (props.$variant === 'success') return theme.colors.success;
    if (props.$variant === 'error') return theme.colors.error;
    return theme.colors.primary;
  }};
  color: ${theme.colors.text};
  padding: ${props => props.$size === 'large' ? '1.2rem' : props.$size === 'small' ? '0.6rem' : '0.8rem'} ${props => props.$size === 'large' ? '2rem' : props.$size === 'small' ? '1.2rem' : '1.6rem'};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-size: ${props => props.$size === 'large' ? '1.1rem' : props.$size === 'small' ? '0.9rem' : '1rem'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: ${theme.transitions.default};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  opacity: ${props => props.$disabled ? 0.7 : 1};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: ${props => {
      if (props.$disabled) return;
      if (props.$variant === 'primary') return theme.colors.buttonHover;
      if (props.$variant === 'accent') return theme.colors.accent;
      if (props.$variant === 'success') return theme.colors.success;
      if (props.$variant === 'error') return theme.colors.error;
      return theme.colors.buttonHover;
    }};
    transform: ${props => !props.$disabled && 'translateY(-2px)'};
    box-shadow: ${props => !props.$disabled && theme.shadows.hover};
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className,
  leftIcon,
  rightIcon
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $disabled={disabled}
      $fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={className}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'accent', 'success', 'error']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node
};

export default Button; 