import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRootStore } from "../Stores";
import Quiz from "../Components/Quiz";
import Results from "../Components/Results";
import ConfirmationPopup from "../Components/ConfirmationPopup";
import { useNavigationBlocker } from "../Hooks/useNavigationBlocker";
import { Button, Card, Spin } from "antd";
import {
  PageContainer,
  GameContainer,
  LoadingText,
  ErrorMessage,
  GlobalTitle,
} from "../styles/QuizPageStyles";

const QuizPage = () => {
  const navigate = useNavigate();
  const { auth, quiz } = useRootStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      quiz.setError("You must be logged in to start the quiz.");
      return;
    }

    if (
      auth.isAuthenticated &&
      !quiz.gameStarted &&
      !quiz.showResults &&
      !quiz.loading &&
      !quiz.error &&
      !hasStartedRef.current
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
          <GlobalTitle>Globetrotter Quiz 🚀</GlobalTitle>
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
          <GlobalTitle>Globetrotter Quiz 🚀</GlobalTitle>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}>
            <Spin style={{
              margin: "0 auto"
            }} size="large" />
            <LoadingText>Preparing quiz... ⏳</LoadingText>
          </div>
        </GameContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <GlobalTitle>Globetrotter Quiz 🚀</GlobalTitle>
      <ConfirmationPopup
        isOpen={showConfirmation}
        onContinue={handleContinueQuiz}
        onEnd={handleEndQuiz}
      />
      <GameContainer>
        {!quiz.gameStarted && !quiz.showResults && (
          <Card>
            <Button onClick={handleStartQuiz}>Start Quiz</Button>
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
            nextButtonText={quiz.isLastQuestion ? "View Results" : "Next Question"}
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
