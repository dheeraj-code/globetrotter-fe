import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useRootStore } from "../Stores";
import { theme } from "../Styles/theme";
import Quiz from "../Components/Quiz";
import Results from "../Components/Results";
import ConfirmationPopup from "../Components/ConfirmationPopup";
import { useNavigationBlocker } from "../hooks/useNavigationBlocker";
import { Button, Card } from "antd";

const PageContainer = styled.div`
  min-height: 90vh;
  width: 100%;
  color: ${theme.colors.text};
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background-image: linear-gradient(
    to right top,
    #a4d0f2,
    #abc2f5,
    #c1b0ee,
    #dc9bd7,
    #f086b3
  );
`;

const GameContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
`;

const LoadingSpinner = styled.div`
  border: 4px solid ${theme.colors.cardBg};
  border-top: 4px solid ${theme.colors.accent};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: ${theme.spacing.lg};

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  margin-top: 1.2rem;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.text};
  padding: 2rem;
  text-align: center;
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  margin: 2rem 0;
  border: 1px solid ${theme.colors.error};
  max-width: 600px;
  width: 100%;
`;

const QuizPage = () => {
  const navigate = useNavigate();
  const { auth, quiz } = useRootStore(); // Updated store usage
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const hasStartedRef = useRef(false);


  useEffect(() => {
    if (!auth.isAuthenticated) {
      quiz.setError("You must be logged in to start the quiz.");
      return;
    }

    console.log("hello")

    if (
      auth.isAuthenticated &&
      !quiz.gameStarted &&
      !quiz.showResults &&
      !quiz.loading &&
      !quiz.error && !hasStartedRef.current
    ) {
      hasStartedRef.current = true;

      quiz.startNewSession();
    }
  }, [
    auth.isAuthenticated,
    quiz.gameStarted,
    quiz.showResults,
    quiz.loading,
    quiz.error,
    quiz,
  ]);

  const handleBlockedNavigation = useCallback((navigationCallback) => {
    setPendingNavigation(() => navigationCallback);
    setShowConfirmation(true);
  }, []);

  useNavigationBlocker(
    quiz.gameStarted && !quiz.showResults,
    handleBlockedNavigation
  );

  const handleContinueQuiz = () => {
    setShowConfirmation(false);
    setPendingNavigation(null);
  };

  const handleEndQuiz = () => {
    setShowConfirmation(false);
    if (pendingNavigation) {
      quiz.resetGame();
      pendingNavigation();
    } else {
      quiz.showResults = true;
      quiz.gameStarted = false;
    }
    setPendingNavigation(null);
  };

  const handleStartQuiz = () => {
    quiz.startNewSession();
  };

  if (quiz.error) {
    return (
      <PageContainer>
        <GameContainer>
          <ErrorMessage>
            {quiz.error}
            <Button onClick={handleStartQuiz}>Try Again</Button>
          </ErrorMessage>
        </GameContainer>
      </PageContainer>
    );
  }

  if (quiz.loading) {
    return (
      <PageContainer>
        <GameContainer>
          <Card>
            <LoadingSpinner />
            <LoadingText>Loading your adventure...</LoadingText>
          </Card>
        </GameContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ConfirmationPopup
        isOpen={showConfirmation}
        onContinue={handleContinueQuiz}
        onEnd={handleEndQuiz}
      />
      <GameContainer>
        {!quiz.gameStarted && !quiz.showResults && (
          <Card>
            <Button onClick={handleStartQuiz}>Start New Quiz</Button>
          </Card>
        )}

        {quiz.gameStarted && quiz.currentQuestion && (
          <Quiz
            question={quiz.currentQuestion.question}
            options={quiz.currentQuestion.options.map((opt) => opt.text)}
            onOptionSelect={quiz.submitAnswer}
            onNextQuestion={quiz.handleNextQuestion}
            currentQuestionNumber={quiz.currentQuestionNumber}
            currentQuestion={quiz.currentQuestion}
            totalQuestions={quiz.totalQuestions}
            isLastQuestion={quiz.isLastQuestion}
          />
        )}

        {quiz.showResults && (
          <Results
            score={quiz.score}
            totalQuestions={quiz.totalQuestions}
            onRestart={handleStartQuiz}
          />
        )}
      </GameContainer>
    </PageContainer>
  );
};

export default QuizPage;
