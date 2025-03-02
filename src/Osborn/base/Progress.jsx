import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from '../../Styles/theme';

const ProgressContainer = styled.div`
  width: 100%;
  max-width: ${props => props.$maxWidth || '100%'};
  background: ${props => props.$variant === 'transparent' ? 'transparent' : theme.colors.primary};
  border-radius: ${props => theme.borderRadius[props.$size]};
  height: ${props => props.$size === 'small' ? '4px' : props.$size === 'large' ? '12px' : '8px'};
  overflow: hidden;
  position: relative;
`;

const ProgressBar = styled.div`
  width: ${props => props.$progress}%;
  height: 100%;
  background: ${props => {
    if (props.$color === 'accent') return theme.colors.accent;
    if (props.$color === 'success') return theme.colors.success;
    if (props.$color === 'error') return theme.colors.error;
    return theme.colors.accent;
  }};
  transition: width ${props => props.$animated ? '0.3s' : '0s'} ease;
  border-radius: inherit;
`;

const Label = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Progress = ({
  progress,
  maxWidth,
  variant = 'default',
  size = 'medium',
  color = 'accent',
  animated = true,
  showLabel = false,
  label,
  className,
}) => {
  return (
    <div className={className}>
      {showLabel && (
        <Label>
          <span>{label}</span>
          <span>{progress}%</span>
        </Label>
      )}
      <ProgressContainer
        $maxWidth={maxWidth}
        $variant={variant}
        $size={size}
      >
        <ProgressBar
          $progress={progress}
          $color={color}
          $animated={animated}
        />
      </ProgressContainer>
    </div>
  );
};

Progress.propTypes = {
  progress: PropTypes.number.isRequired,
  maxWidth: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'transparent']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['accent', 'success', 'error']),
  animated: PropTypes.bool,
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default Progress; 