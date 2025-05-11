import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { theme } from "../Styles/theme";
import { Card, Typography, Progress, Button, Alert } from "antd";
import { useRootStore } from "../Stores";

const { Title } = Typography;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const FeedbackSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing.md};
  align-items: center;
  justify-content: space-between;
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

const Quiz = ({
  question,
  options,
  onOptionSelect,
  onNextQuestion,
  currentQuestionNumber,
  currentQuestion,
  totalQuestions,
  isLastQuestion,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);

const { score } = useRootStore().quiz;
  const progress = (score / totalQuestions) * 100;

  const handleOptionClick = async (option) => {
    if (showFeedback) return;

    setSelectedOption(option);
    console.log(option)
    const result = await onOptionSelect(option.id);

    console.log(result, question, currentQuestion, option);

    if (result) {
      setFeedback({
        isCorrect: result.isCorrect,
        funFact: result.funFact,
        trivia: result.trivia,
        correctAnswerIndex: result.correctAnswerIndex,
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

  return (
    <Card
      size="large"
      style={{
        width: "700px",
      }}
      title={
        <Progress
          percent={progress}
          color="accent"
          size="medium"
          variant="default"
          animated={true}
          showLabel={true}
          label={`Question ${currentQuestionNumber} of ${totalQuestions}`}
        />
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Title strong level={3}>
          {question}
        </Title>

        <OptionsGrid>
          {currentQuestion.options.map((option, index) => {
            let buttonColor = "purple";
            if (showFeedback) {
              if (feedback.correctAnswerIndex === index) {
                buttonColor = "green";
              } else if (selectedOption === option) {
                buttonColor = "danger";
              }
            } else if (selectedOption === option) {
              buttonColor = "purple";
            }
            
            return (
              <Button
                type="primary"
                key={index}
                onClick={() => handleOptionClick(option)}
                disabled={showFeedback}
                color={buttonColor}
              >
                {options[index]}
              </Button>
            );
          })}
        </OptionsGrid>

        {showFeedback && (
          <FeedbackSection>
            <Alert
              type={feedback.isCorrect ? "success" : "error"}
              title={feedback.isCorrect ? "Correct! 🎉" : "Incorrect"}
              message={
                feedback.isCorrect
                  ? "Great job! You got it right!"
                  : `The correct answer was: ${
                      options[feedback.correctAnswerIndex]
                    }`
              }
              showIcon
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

            <Button onClick={handleNextClick} variant="primary">
              {isLastQuestion ? "Show Results" : "Next Question >>"}
            </Button>
          </FeedbackSection>
        )}
      </div>
    </Card>
  );
};

Quiz.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onOptionSelect: PropTypes.func.isRequired,
  onNextQuestion: PropTypes.func.isRequired,
  currentQuestionNumber: PropTypes.number.isRequired,
  currentQuestion: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  isLastQuestion: PropTypes.bool.isRequired,
};

export default Quiz;
