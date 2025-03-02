import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Quiz from '../Components/Quiz';
import Results from '../Components/Results';
import quizService from '../Services/quizService';
import { theme } from '../styles/theme';
import { authService } from '../Services/auth';

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

const GamePage = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const initializeQuizSession = async () => {
    try {
      const newSessionId = await quizService.startQuizSession();
      setSessionId(newSessionId);
      setGameStarted(true);
      await fetchNextQuestion(newSessionId);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 400) {
        // Token is invalid or expired
        authService.logout();
        navigate('/login');
      } else {
        setError(`Failed to start quiz: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication first
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Initialize the quiz session
    initializeQuizSession();
  }, [navigate]);

  const startNewSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const newSessionId = await quizService.startQuizSession();
      setSessionId(newSessionId);
      setGameStarted(true);
      setShowResults(false);
      setScore(0);
      setQuestionCount(0);
      await fetchNextQuestion(newSessionId);
    } catch (err) {
      setError(`Failed to start the quiz: ${err.message}`);
      setLoading(false);
    }
  };

  const fetchNextQuestion = async (sid) => {
    try {
      setLoading(true);
      const questionData = await quizService.getRandomQuestion(sid);
      
      if (!questionData) {
        throw new Error('No question data received');
      }

      const clueText = questionData.clue && typeof questionData.clue === 'object' 
        ? (questionData.clue.clue || 'No clue text available')
        : (typeof questionData.clue === 'string' ? questionData.clue : 'No clue provided');

      const transformedQuestion = {
        id: questionData.id,
        question: clueText,
        options: Array.isArray(questionData.options) ? questionData.options.map((opt, index) => ({
          id: opt.id || index,
          text: opt.city && opt.country ? `${opt.city}, ${opt.country}` : 'Unknown location',
          index
        })) : [],
        correctAnswer: Array.isArray(questionData.options) ? 
          questionData.options.findIndex(opt => opt.id === questionData.cityId) : 0
      };

      setCurrentQuestion(transformedQuestion);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch the question: ${err.message}`);
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (selectedOption) => {
    try {
      const selectedOptionIndex = currentQuestion.options.findIndex(opt => opt.text === selectedOption);
      const selectedOptionData = currentQuestion.options[selectedOptionIndex];
      
      const result = await quizService.submitAnswer(
        sessionId,
        currentQuestion.id,
        selectedOptionData.id
      );

      if (result.isCorrect) {
        setScore(prev => prev + 1);
      }

      setQuestionCount(prev => prev + 1);

      return {
        isCorrect: result.isCorrect,
        funFact: result.funFact,
        trivia: result.trivia,
        correctAnswerIndex: currentQuestion.correctAnswer
      };
    } catch {
      setError('Failed to submit answer. Please try again.');
      return null;
    }
  };

  const handleNextQuestion = async () => {
    if (questionCount >= 4) {
      setShowResults(true);
      setGameStarted(false);
    } else {
      await fetchNextQuestion(sessionId);
    }
  };

  if (error) {
    return (
      <PageContainer>
        <GameContainer>
          <ErrorMessage>
            {error}
            <StartButton onClick={startNewSession}>Try Again</StartButton>
          </ErrorMessage>
        </GameContainer>
      </PageContainer>
    );
  }

  if (loading) {
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
        {!gameStarted && !showResults && (
          <StartCard>
            <StartButton onClick={startNewSession}>
              Start New Quiz
            </StartButton>
          </StartCard>
        )}

        {gameStarted && currentQuestion && (
          <Quiz
            question={currentQuestion.question}
            options={currentQuestion.options.map(opt => opt.text)}
            onOptionSelect={handleAnswerSubmit}
            onNextQuestion={handleNextQuestion}
            currentQuestion={questionCount + 1}
            totalQuestions={5}
            isLastQuestion={questionCount >= 4}
          />
        )}

        {showResults && (
          <Results
            score={score}
            totalQuestions={5}
            onRestart={startNewSession}
          />
        )}
      </GameContainer>
    </PageContainer>
  );
};

export default GamePage; 