import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from '../../Styles/theme';

const FeedbackContainer = styled.div`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  background: ${props => {
    if (props.$type === 'success') return `${theme.colors.success}15`;
    if (props.$type === 'error') return `${theme.colors.error}15`;
    if (props.$type === 'info') return `${theme.colors.accent}15`;
    return `${theme.colors.primary}15`;
  }};
  border: 1px solid ${props => {
    if (props.$type === 'success') return theme.colors.success;
    if (props.$type === 'error') return theme.colors.error;
    if (props.$type === 'info') return theme.colors.accent;
    return theme.colors.primary;
  }};
  margin: ${props => props.$margin || `${theme.spacing.sm} 0`};
`;

const Header = styled.div`
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${props => {
    if (props.$type === 'success') return theme.colors.success;
    if (props.$type === 'error') return theme.colors.error;
    if (props.$type === 'info') return theme.colors.accent;
    return theme.colors.primary;
  }};
  margin-bottom: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const Content = styled.div`
  color: ${theme.colors.text};
  font-size: ${theme.typography.fontSize.xs};
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const DetailSection = styled.div`
  background: ${theme.colors.primary};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  margin-top: ${theme.spacing.sm};

  h4 {
    color: ${theme.colors.accent};
    font-size: ${theme.typography.fontSize.xs};
    margin-bottom: ${theme.spacing.xs};
    font-weight: ${theme.typography.fontWeight.bold};
  }

  p {
    color: ${theme.colors.textSecondary};
    font-size: ${theme.typography.fontSize.xs};
    margin: 0;
  }
`;

const FeedbackMessage = ({
  type = 'info',
  title,
  message,
  details,
  margin,
  className,
  icon: Icon
}) => {
  return (
    <FeedbackContainer
      $type={type}
      $margin={margin}
      className={className}
    >
      <Header $type={type}>
        {Icon && <Icon />}
        {title}
      </Header>
      <Content>
        {message}
        {details && (
          <DetailSection>
            <h4>Additional Information</h4>
            <p>{details}</p>
          </DetailSection>
        )}
      </Content>
    </FeedbackContainer>
  );
};

FeedbackMessage.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'info']),
  title: PropTypes.string.isRequired,
  message: PropTypes.node.isRequired,
  details: PropTypes.string,
  margin: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.elementType
};

export default FeedbackMessage; 