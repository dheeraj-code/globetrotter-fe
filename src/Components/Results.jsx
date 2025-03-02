import styled from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from '../styles/theme';

const ResultsContainer = styled.div`
  max-width: 600px;
  width: 100%;
  padding: 3rem;
  background: ${theme.colors.cardBg};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.card};
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ScoreDisplay = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: ${theme.colors.accent};
  margin: 2rem 0;
`;

const Message = styled.p`
  font-size: 1.4rem;
  color: ${theme.colors.textSecondary};
  margin: 2rem 0;
  line-height: 1.6;
`;

const Button = styled.button`
  padding: 1.2rem 2.5rem;
  font-size: 1.4rem;
  background: ${theme.colors.accent};
  color: ${theme.colors.text};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.button};
  font-weight: 600;

  &:hover {
    background: ${theme.colors.buttonHover};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.hover};
  }
`;

const ResultTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
`;

const Results = ({ score, totalQuestions, onRestart }) => {
  const percentage = (score / totalQuestions) * 100;
  
  const getMessage = () => {
    if (percentage === 100) return "Perfect score! You're a geography master! 🏆";
    if (percentage >= 80) return "Excellent work! You're a true globetrotter! 🌍";
    if (percentage >= 60) return "Good job! Keep exploring the world! 🗺️";
    if (percentage >= 40) return "Not bad! Room for improvement! 📚";
    return "Keep learning! The world is vast and fascinating! 🌎";
  };

  return (
    <ResultsContainer>
      <ResultTitle>Quiz Complete!</ResultTitle>
      <ScoreDisplay>
        {score}/{totalQuestions}
      </ScoreDisplay>
      <Message>{getMessage()}</Message>
      <Button onClick={onRestart}>Play Again</Button>
    </ResultsContainer>
  );
};

Results.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onRestart: PropTypes.func.isRequired,
};

export default Results; 