import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useStores } from '../Stores';
import { theme } from '../Styles/theme';
import Quiz from '../Components/Quiz';
import Results from '../Components/Results';

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
  padding: 2rem;
  background: ${theme.colors.background};
`;

const StartCard = styled.div`
  background: ${theme.colors.cardBg};
  padding: 3rem;
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.card};
  max-width: 600px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StartButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.3rem;
  background: ${theme.colors.accent};
  color: ${theme.colors.text};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.button};
  font-weight: 600;

  &:hover {
    transform: translateY(-3px);
    background: ${theme.colors.buttonHover};
    box-shadow: ${theme.shadows.hover};
  }

  &::after {
    content: '🎯';
    margin-left: 10px;
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
  margin: 2rem;

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

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      navigate('/login');
      return;
    }

    quizStore.startNewSession();
  }, [navigate, authStore.isAuthenticated]);

  if (quizStore.error) {
    return (
      <PageContainer>
        <GameContainer>
          <ErrorMessage>
            {quizStore.error}
            <StartButton onClick={quizStore.startNewSession}>Try Again</StartButton>
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
      <GameContainer>
        {!quizStore.gameStarted && !quizStore.showResults && (
          <StartCard>
            <StartButton onClick={quizStore.startNewSession}>
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
            currentQuestion={quizStore.questionCount + 1}
            totalQuestions={quizStore.totalQuestions}
            isLastQuestion={quizStore.questionCount + 1 === quizStore.totalQuestions}
          />
        )}

        {quizStore.showResults && (
          <Results
            score={quizStore.score}
            totalQuestions={quizStore.totalQuestions}
            onRestart={quizStore.startNewSession}
          />
        )}
      </GameContainer>
    </PageContainer>
  );
});

export default QuizPage; 