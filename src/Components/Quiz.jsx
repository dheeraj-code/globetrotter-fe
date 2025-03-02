import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { theme } from '../Styles/theme';
import Button from '../Osborn/base/Button';
import Card from '../Osborn/base/Card';
import Progress from '../Osborn/base/Progress';
import FeedbackMessage from '../Osborn/feedback/FeedbackMessage';

const QuizContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};
`;

const QuestionText = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const FeedbackSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const FunFactContainer = styled.div`
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

const Quiz = observer(({
  question,
  options,
  onOptionSelect,
  onNextQuestion,
  currentQuestion,
  totalQuestions,
  isLastQuestion
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleOptionClick = async (option) => {
    if (showFeedback) return;
    
    setSelectedOption(option);
    const result = await onOptionSelect(option);
    
    if (result) {
      setFeedback({
        isCorrect: result.isCorrect,
        funFact: result.funFact,
        trivia: result.trivia,
        correctAnswerIndex: result.correctAnswerIndex
      });
      setShowFeedback(true);
    }
  };

  const handleNextClick = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setFeedback(null);
    onNextQuestion();
  };

  const progress = ((currentQuestion - 1) / totalQuestions) * 100;

  return (
    <QuizContainer>
      <Progress 
        progress={progress}
        color="accent"
        size="medium"
        variant="default"
        animated={true}
        showLabel={true}
        label={`Question ${currentQuestion} of ${totalQuestions}`}
      />
      
      <Card padding="large">
        <QuestionText>{question}</QuestionText>
        
        <OptionsGrid>
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={showFeedback}
              variant={
                showFeedback
                  ? feedback.correctAnswerIndex === index
                    ? 'success'
                    : selectedOption === option
                    ? 'error'
                    : 'default'
                  : selectedOption === option
                  ? 'primary'
                  : 'default'
              }
              fullWidth
            >
              {option}
            </Button>
          ))}
        </OptionsGrid>

        {showFeedback && (
          <FeedbackSection>
            <Button
              onClick={handleNextClick}
              variant="primary"
              fullWidth
            >
              {isLastQuestion ? 'Show Results' : 'Next Question'}
            </Button>

            <FeedbackMessage
              type={feedback.isCorrect ? 'success' : 'error'}
              title={feedback.isCorrect ? "Correct! 🎉" : "Incorrect"}
              message={
                feedback.isCorrect 
                  ? "Great job! You got it right!"
                  : `The correct answer was: ${options[feedback.correctAnswerIndex]}`
              }
            />
            
            {feedback.funFact && (
              <FunFactContainer>
                <h3>📚 Fun Fact</h3>
                <p>{feedback.funFact}</p>
              </FunFactContainer>
            )}

            {feedback.trivia && (
              <FunFactContainer>
                <h3>🎯 Trivia</h3>
                <p>{feedback.trivia}</p>
              </FunFactContainer>
            )}
          </FeedbackSection>
        )}
      </Card>
    </QuizContainer>
  );
});

Quiz.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onOptionSelect: PropTypes.func.isRequired,
  onNextQuestion: PropTypes.func.isRequired,
  currentQuestion: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  isLastQuestion: PropTypes.bool.isRequired
};

export default Quiz; 