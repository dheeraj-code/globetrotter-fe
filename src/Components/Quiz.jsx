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
  gap: 2rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const QuestionText = styled.h2`
  font-size: 1.5rem;
  color: ${theme.colors.text};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FeedbackSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const FunFactContainer = styled.div`
  margin-top: 0.5rem;
  padding: 1.5rem;
  background-color: ${theme.colors.cardBg};
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${theme.colors.accent}40;

  h3 {
    color: ${theme.colors.accent};
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    color: ${theme.colors.textSecondary};
    font-size: 1rem;
    line-height: 1.6;
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

            <Button
              onClick={handleNextClick}
              variant="primary"
              fullWidth
            >
              {isLastQuestion ? 'Show Results' : 'Next Question'}
            </Button>
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