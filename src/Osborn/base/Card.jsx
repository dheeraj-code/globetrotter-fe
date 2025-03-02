import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from '../../Styles/theme';

const StyledCard = styled.div`
  background: ${props => props.$variant === 'transparent' ? 'transparent' : theme.colors.cardBg};
  border-radius: ${props => theme.borderRadius[props.$rounded]};
  padding: ${props => {
    if (props.$padding === 'none') return '0';
    if (props.$padding === 'small') return '1rem';
    if (props.$padding === 'large') return '2.5rem';
    return '1.5rem';
  }};
  width: 100%;
  max-width: ${props => props.$maxWidth || 'none'};
  box-shadow: ${props => props.$elevation === 'none' ? 'none' : theme.shadows[props.$elevation]};
  border: ${props => props.$bordered ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
  position: relative;
  overflow: ${props => props.$overflow || 'visible'};
  
  ${props => props.$hover && `
    transition: ${theme.transitions.default};
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.hover};
    }
  `}
`;

const Card = ({
  children,
  variant = 'default',
  padding = 'medium',
  rounded = 'medium',
  elevation = 'card',
  maxWidth,
  hover = false,
  bordered = true,
  overflow,
  className,
}) => {
  return (
    <StyledCard
      $variant={variant}
      $padding={padding}
      $rounded={rounded}
      $elevation={elevation}
      $maxWidth={maxWidth}
      $hover={hover}
      $bordered={bordered}
      $overflow={overflow}
      className={className}
    >
      {children}
    </StyledCard>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'transparent']),
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  rounded: PropTypes.oneOf(['small', 'medium', 'large']),
  elevation: PropTypes.oneOf(['none', 'card', 'hover']),
  maxWidth: PropTypes.string,
  hover: PropTypes.bool,
  bordered: PropTypes.bool,
  overflow: PropTypes.string,
  className: PropTypes.string,
};

export default Card; 