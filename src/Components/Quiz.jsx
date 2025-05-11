import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Typography, Progress, Button, Alert } from "antd";
import { useRootStore } from "../Stores";
import {
  OptionsGrid,
  FeedbackSection,
  FunFactContainer,
} from "../styles/QuizStyles";

const { Title } = Typography;

const Quiz = ({
  question,
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
    const result = await onOptionSelect(option.id);

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

  const getCorrectAnswerText = () => {
    const correct = currentQuestion.options.find(
      (opt) => opt.id === feedback.correctAnswerIndex
    );
    return correct ? correct.text : "Unknown";
  };

  return (
    <Card
      size="large"
      style={{ width: "700px" }}
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
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Title strong level={3}>
          {question}
        </Title>

        <OptionsGrid>
          {currentQuestion.options.map((option) => {
            let buttonColor = "purple";

            if (showFeedback) {
              if (option.id === feedback.correctAnswerIndex) {
                buttonColor = "green";
              } else if (selectedOption?.id === option.id) {
                buttonColor = "danger";
              }
            } else if (selectedOption?.id === option.id) {
              buttonColor = "purple";
            }

            return (
              <Button
                type="primary"
                key={option.id}
                onClick={() => handleOptionClick(option)}
                disabled={showFeedback}
                color={buttonColor}
              >
                {option.text}
              </Button>
            );
          })}
        </OptionsGrid>

        {showFeedback && (
          <FeedbackSection>
            <Alert
              type={feedback.isCorrect ? "success" : "error"}
              title={feedback.isCorrect ? "Correct!" : "Incorrect"}
              message={
                feedback.isCorrect
                  ? "Well done! Your answer is correct."
                  : `The correct answer was: ${getCorrectAnswerText()}`
              }
              showIcon
            />

            {feedback.funFact && (
              <FunFactContainer>
                <h3>Fun Fact</h3>
                <p>{feedback.funFact}</p>
              </FunFactContainer>
            )}

            {feedback.trivia && (
              <FunFactContainer>
                <h3>Trivia</h3>
                <p>{feedback.trivia}</p>
              </FunFactContainer>
            )}

            <Button onClick={handleNextClick} variant="primary">
              {isLastQuestion ? "View Results" : "Next Question"}
            </Button>
          </FeedbackSection>
        )}
      </div>
    </Card>
  );
};

Quiz.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onOptionSelect: PropTypes.func.isRequired,
  onNextQuestion: PropTypes.func.isRequired,
  currentQuestionNumber: PropTypes.number.isRequired,
  currentQuestion: PropTypes.object.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  isLastQuestion: PropTypes.bool.isRequired,
};

export default Quiz;
