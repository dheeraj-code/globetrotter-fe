import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useStores } from '../Stores';
import { theme } from '../Styles/theme';
import Quiz from '../Components/Quiz';
import Results from '../Components/Results';
import ConfirmationPopup from '../Components/ConfirmationPopup';
import { useNavigationBlocker } from '../hooks/useNavigationBlocker';

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const GameContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background};
`;

const StartCard = styled.div`
  background: ${theme.colors.cardBg};
  padding: ${theme.spacing['2xl']};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.card};
  max-width: 600px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StartButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.lg};
  background: ${theme.colors.accent};
  color: ${theme.colors.text};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.button};
  font-weight: ${theme.typography.fontWeight.semibold};

  &:hover {
    transform: translateY(-3px);
    background: ${theme.colors.buttonHover};
    box-shadow: ${theme.shadows.hover};
  }

  &::after {
    content: '🎯';
    margin-left: ${theme.spacing.xs};
    display: inline-block;
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: scale(1.2);
  }
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  margin-top: 1.2rem;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
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

const QuizPage = observer(() => {
  const navigate = useNavigate();
  const { authStore, quizStore } = useStores();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Handle initial authentication check and quiz session
  useEffect(() => {
    if (!authStore.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!quizStore.gameStarted && !quizStore.showResults) {
      quizStore.startNewSession();
    }
  }, [authStore.isAuthenticated, navigate, quizStore]);

  const handleBlockedNavigation = useCallback((navigationCallback) => {
    setPendingNavigation(() => navigationCallback);
    setShowConfirmation(true);
  }, []);

  useNavigationBlocker(
    quizStore.gameStarted && !quizStore.showResults,
    handleBlockedNavigation
  );

  const handleContinueQuiz = () => {
    setShowConfirmation(false);
    setPendingNavigation(null);
  };

  const handleEndQuiz = () => {
    setShowConfirmation(false);
    if (pendingNavigation) {
      quizStore.resetGame();
      pendingNavigation();
    } else {
      quizStore.showResults = true;
      quizStore.gameStarted = false;
    }
    setPendingNavigation(null);
  };

  const handleStartQuiz = () => {
    quizStore.startNewSession();
  };

  if (quizStore.error) {
    return (
      <PageContainer>
        <GameContainer>
          <ErrorMessage>
            {quizStore.error}
            <StartButton onClick={handleStartQuiz}>Try Again</StartButton>
          </ErrorMessage>
        </GameContainer>
      </PageContainer>
    );
  }

  if (quizStore.loading) {
    return (
      <PageContainer>
        <GameContainer>
          <StartCard>
            <LoadingSpinner />
            <LoadingText>Loading your adventure...</LoadingText>
          </StartCard>
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
        {!quizStore.gameStarted && !quizStore.showResults && (
          <StartCard>
            <StartButton onClick={handleStartQuiz}>
              Start New Quiz
            </StartButton>
          </StartCard>
        )}

        {quizStore.gameStarted && quizStore.currentQuestion && (
          <Quiz
            question={quizStore.currentQuestion.question}
            options={quizStore.currentQuestion.options.map(opt => opt.text)}
            onOptionSelect={quizStore.submitAnswer}
            onNextQuestion={quizStore.handleNextQuestion}
            currentQuestion={quizStore.currentQuestionNumber}
            totalQuestions={quizStore.totalQuestions}
            isLastQuestion={quizStore.isLastQuestion}
          />
        )}

        {quizStore.showResults && (
          <Results
            score={quizStore.score}
            totalQuestions={quizStore.totalQuestions}
            onRestart={handleStartQuiz}
          />
        )}
      </GameContainer>
    </PageContainer>
  );
});

export default QuizPage; 