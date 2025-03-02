import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from '../../Styles/theme';

const StyledContainer = styled.div`
  min-height: ${props => props.$fullHeight ? '100vh' : 'auto'};
  width: 100%;
  max-width: ${props => props.$maxWidth || '1200px'};
  margin: 0 auto;
  padding: ${props => {
    if (props.$padding === 'none') return '0';
    if (props.$padding === 'small') return theme.spacing.sm;
    if (props.$padding === 'large') return theme.spacing['2xl'];
    return theme.spacing.lg;
  }};
  background-color: ${props => props.$background || 'transparent'};
  display: flex;
  flex-direction: ${props => props.$direction || 'column'};
  align-items: ${props => props.$align || 'stretch'};
  justify-content: ${props => props.$justify || 'flex-start'};
  gap: ${props => props.$gap || '0'};
  position: relative;

  @media (max-width: 768px) {
    padding: ${props => {
      if (props.$padding === 'none') return '0';
      if (props.$padding === 'small') return theme.spacing.xs;
      if (props.$padding === 'large') return theme.spacing.md;
      return theme.spacing.sm;
    }};
  }
`;

const Container = ({
  children,
  maxWidth,
  padding = 'medium',
  background,
  fullHeight = false,
  direction,
  align,
  justify,
  gap,
  className,
}) => {
  return (
    <StyledContainer
      $maxWidth={maxWidth}
      $padding={padding}
      $background={background}
      $fullHeight={fullHeight}
      $direction={direction}
      $align={align}
      $justify={justify}
      $gap={gap}
      className={className}
    >
      {children}
    </StyledContainer>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  background: PropTypes.string,
  fullHeight: PropTypes.bool,
  direction: PropTypes.oneOf(['row', 'column', 'row-reverse', 'column-reverse']),
  align: PropTypes.oneOf(['stretch', 'center', 'flex-start', 'flex-end', 'baseline']),
  justify: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']),
  gap: PropTypes.string,
  className: PropTypes.string,
};

export default Container; 