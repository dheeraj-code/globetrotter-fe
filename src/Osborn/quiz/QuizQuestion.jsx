import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from '../../Styles/theme';
import Card from '../base/Card';
import Button from '../base/Button';
import Progress from '../base/Progress';
import FeedbackMessage from '../feedback/FeedbackMessage';

const QuestionText = styled.h2`
  color: ${theme.colors.text};
  font-size: ${theme.typography.fontSize.xl};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
  line-height: ${theme.typography.lineHeight.normal};
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};
  margin: ${theme.spacing.lg} 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const QuestionCounter = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.xs};
  text-align: center;
  margin-bottom: ${theme.spacing.xs};
`;

const QuizQuestion = ({
  question,
  options,
  currentQuestion,
  totalQuestions,
  onOptionSelect,
  onNextQuestion,
  isLastQuestion,
  className
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const progress = ((currentQuestion) / totalQuestions) * 100;

  const handleOptionClick = async (option) => {
    if (showFeedback) return;
    
    setSelectedOption(option);
    const result = await onOptionSelect(option);
    
    if (result) {
      setFeedback(result);
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setFeedback(null);
    onNextQuestion();
  };

  return (
    <div className={className}>
      <Progress
        progress={progress}
        maxWidth="800px"
        showLabel
        label={`Question ${currentQuestion} of ${totalQuestions}`}
      />
      
      <Card maxWidth="800px" padding="large" className="mt-4">
        <QuestionCounter>
          Question {currentQuestion} of {totalQuestions}
        </QuestionCounter>
        
        <QuestionText>{question}</QuestionText>
        
        <OptionsGrid>
          {options.map((option, index) => (
            <Button
              key={index}
              variant={
                !showFeedback
                  ? selectedOption === option ? 'accent' : 'primary'
                  : feedback?.correctAnswerIndex === index
                  ? 'success'
                  : selectedOption === option && feedback?.correctAnswerIndex !== index
                  ? 'error'
                  : 'primary'
              }
              fullWidth
              disabled={showFeedback}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </Button>
          ))}
        </OptionsGrid>

        {showFeedback && feedback && (
          <FeedbackMessage
            type={feedback.isCorrect ? 'success' : 'error'}
            title={feedback.isCorrect ? 'Correct!' : 'Incorrect'}
            message={feedback.explanation}
            margin="1.5rem 0"
          />
        )}

        {showFeedback && (
          <Button
            variant="accent"
            fullWidth
            onClick={handleNext}
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </Button>
        )}
      </Card>
    </div>
  );
};

QuizQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentQuestion: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onOptionSelect: PropTypes.func.isRequired,
  onNextQuestion: PropTypes.func.isRequired,
  isLastQuestion: PropTypes.bool.isRequired,
  className: PropTypes.string
};

export default QuizQuestion; 