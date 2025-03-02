import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from '../../styles/theme';

const FeedbackContainer = styled.div`
  padding: 1.5rem;
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
  margin: ${props => props.$margin || '1rem 0'};
`;

const Header = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${props => {
    if (props.$type === 'success') return theme.colors.success;
    if (props.$type === 'error') return theme.colors.error;
    if (props.$type === 'info') return theme.colors.accent;
    return theme.colors.primary;
  }};
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Content = styled.div`
  color: ${theme.colors.text};
  font-size: 0.95rem;
  line-height: 1.5;
`;

const DetailSection = styled.div`
  background: ${theme.colors.primary};
  padding: 1rem;
  border-radius: ${theme.borderRadius.small};
  margin-top: 1rem;

  h4 {
    color: ${theme.colors.accent};
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  p {
    color: ${theme.colors.textSecondary};
    font-size: 0.9rem;
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