import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from '../styles/theme';

const QuizContainer = styled.div`
  width: 100%;
  background-color: ${theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const QuestionCard = styled.div`
  background: ${theme.colors.cardBg};
  border-radius: ${theme.borderRadius.large};
  padding: 2.5rem;
  width: 100%;
  max-width: 800px;
  box-shadow: ${theme.shadows.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
`;

const QuestionText = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.4;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Option = styled.button`
  background: ${props => {
    if (!props.$showFeedback) {
      return props.$selected ? theme.colors.accent : theme.colors.primary;
    }
    if (props.$isCorrect) {
      return theme.colors.success;
    }
    if (props.$selected && !props.$isCorrect) {
      return theme.colors.error;
    }
    return theme.colors.primary;
  }};
  color: ${theme.colors.text};
  padding: 1.2rem;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-size: 1rem;
  cursor: pointer;
  transition: ${theme.transitions.default};
  width: 100%;
  text-align: left;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  span.icon {
    margin-left: 0.8rem;
    font-size: 1.2rem;
  }

  &:hover {
    transform: ${props => !props.$showFeedback && 'translateY(-2px)'};
    background: ${props => {
      if (!props.$showFeedback) {
        return props.$selected ? theme.colors.accent : theme.colors.buttonHover;
      }
      if (props.$isCorrect) {
        return theme.colors.success;
      }
      if (props.$selected && !props.$isCorrect) {
        return theme.colors.error;
      }
      return theme.colors.primary;
    }};
    box-shadow: ${props => !props.$showFeedback && theme.shadows.hover};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: ${props => props.$isCorrect || (props.$selected && !props.$isCorrect) ? 1 : 0.7};
    transform: none;
  }
`;

const Progress = styled.div`
  width: 100%;
  max-width: 800px;
  background: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.small};
  height: 8px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background: ${theme.colors.accent};
  transition: width 0.3s ease;
`;

const FeedbackContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  border-radius: ${theme.borderRadius.medium};
  background: ${theme.colors.cardBg};
  color: ${theme.colors.text};
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FeedbackHeader = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.isCorrect ? theme.colors.success : theme.colors.error};
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const FeedbackSection = styled.div`
  background: ${theme.colors.primary};
  padding: 1.2rem;
  border-radius: ${theme.borderRadius.medium};
  margin-top: 1.2rem;

  h3 {
    color: ${theme.colors.accent};
    font-size: 1rem;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    color: ${theme.colors.textSecondary};
    font-size: 0.95rem;
    line-height: 1.5;
    text-align: left;
  }
`;

const InfoBox = styled.div`
  margin-top: 1.5rem;
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
`;

const NextButton = styled.button`
  background: ${theme.colors.accent};
  color: ${theme.colors.text};
  padding: 0.8rem 1.6rem;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-size: 1rem;
  cursor: pointer;
  transition: ${theme.transitions.default};
  margin-top: 1.5rem;
  width: 100%;

  &:hover {
    background: ${theme.colors.buttonHover};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.hover};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }
`;

const QuestionCounter = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 0.8rem;
`;

const Quiz = ({
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
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);

  const handleOptionClick = async (option) => {
    if (showFeedback) return;
    
    setSelectedOption(option);
    const result = await onOptionSelect(option);
    
    if (result) {
      setFeedback(result);
      setShowFeedback(true);
      setCorrectAnswerIndex(result.correctAnswerIndex);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setFeedback(null);
    setCorrectAnswerIndex(null);
    onNextQuestion();
  };

  const progress = ((currentQuestion) / totalQuestions) * 100;

  return (
    <QuizContainer>
      <Progress>
        <ProgressBar progress={progress} />
      </Progress>
      
      <QuestionCard>
        <QuestionCounter>
          Question {currentQuestion} of {totalQuestions}
        </QuestionCounter>
        
        <QuestionText>{question}</QuestionText>
        
        <OptionsGrid>
          {options.map((option, index) => (
            <Option
              key={index}
              onClick={() => handleOptionClick(option)}
              $selected={selectedOption === option}
              $isCorrect={showFeedback && index === correctAnswerIndex}
              $showFeedback={showFeedback}
              disabled={showFeedback}
            >
              <span className="text">{option}</span>
              {showFeedback && (
                <span className="icon">
                  {index === correctAnswerIndex && '✓'}
                  {selectedOption === option && index !== correctAnswerIndex && '✗'}
                </span>
              )}
            </Option>
          ))}
        </OptionsGrid>

        {showFeedback && feedback && (
          <>
            <FeedbackContainer>
              <FeedbackHeader isCorrect={feedback.isCorrect}>
                {feedback.isCorrect ? (
                  <>✓ Correct Answer!</>
                ) : (
                  <>✗ Incorrect Answer - The correct answer was {options[correctAnswerIndex]}</>
                )}
              </FeedbackHeader>

              {feedback.funFact && (
                <FeedbackSection>
                  <h3>📚 Fun Fact</h3>
                  <p>{feedback.funFact}</p>
                </FeedbackSection>
              )}

              {feedback.trivia && (
                <FeedbackSection>
                  <h3>🎯 Trivia</h3>
                  <p>{feedback.trivia}</p>
                </FeedbackSection>
              )}

              <NextButton onClick={handleNext}>
                {isLastQuestion ? 'See Results' : 'Next Question'}
              </NextButton>
            </FeedbackContainer>
          </>
        )}
      </QuestionCard>
    </QuizContainer>
  );
};

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