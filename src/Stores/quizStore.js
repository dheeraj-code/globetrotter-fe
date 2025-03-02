import { makeAutoObservable, runInAction } from 'mobx';
import quizService from '../Services/quizService';
import challengeService from '../Services/challengeService';

class QuizStore {
  sessionId = null;
  currentQuestion = null;
  loading = false;
  error = null;
  gameStarted = false;
  showResults = false;
  score = 0;
  questionCount = 0;
  totalQuestions = 5;
  challengerScore = null;
  isChallenge = false;
  challengeId = null;
  inviteLink = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading = (status) => {
    this.loading = status;
  };

  setError = (error) => {
    this.error = error;
  };

  setChallengerScore = (score) => {
    this.challengerScore = score;
    this.isChallenge = true;
  };

  startNewSession = async () => {
    try {
      this.setLoading(true);
      this.setError(null);
      this.gameStarted = false;
      this.showResults = false;
      this.score = 0;
      this.questionCount = 0;
      this.challengerScore = null;
      this.isChallenge = false;
      this.challengeId = null;
      this.inviteLink = null;
      
      const newSessionId = await quizService.startQuizSession();
      this.sessionId = newSessionId;
      this.gameStarted = true;
      
      await this.fetchNextQuestion();
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  };

  createChallenge = async () => {
    try {
      this.setLoading(true);
      this.setError(null);
      this.inviteLink = null;
      this.challengeId = null;
      
      if (!this.sessionId) {
        throw new Error('No active quiz session found');
      }

      const result = await challengeService.createChallenge(this.sessionId);
      
      if (!result || !result.inviteLink) {
        throw new Error('Invalid response from server: missing invite link');
      }

      runInAction(() => {
        this.challengeId = result.id;
        this.inviteLink = result.inviteLink;
      });

      return result;
    } catch (error) {
      this.setError(error.message || 'Failed to create challenge');
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  getChallengeInfo = async (inviteLink) => {
    try {
      this.setLoading(true);
      const challenge = await challengeService.getChallengeByLink(inviteLink);
      
      if (challenge.isOwnChallenge) {
        throw new Error('Cannot accept your own challenge');
      }

      if (challenge.isAlreadyAccepted) {
        throw new Error('Challenge already accepted');
      }

      return {
        inviterScore: challenge.inviter_score ?? 0,
        totalQuestions: this.totalQuestions,
        id: challenge.id
      };
    } catch (error) {
      this.setError(error.message);
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  startChallenge = async (inviteLink) => {
    try {
      this.setLoading(true);
      const challenge = await challengeService.getChallengeByLink(inviteLink);
      
      if (challenge.isOwnChallenge) {
        throw new Error('Cannot accept your own challenge');
      }

      if (challenge.isAlreadyAccepted) {
        throw new Error('Challenge already accepted');
      }

      const result = await challengeService.acceptChallenge(inviteLink);
      this.sessionId = result.quizSession.id;
      this.challengerScore = challenge.inviter_score ?? 0;
      this.isChallenge = true;
      this.challengeId = challenge.id;
      this.gameStarted = true;

      await this.fetchNextQuestion();
      return challenge;
    } catch (error) {
      this.setError(error.message);
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  fetchNextQuestion = async () => {
    try {
      this.setLoading(true);
      const questionData = await quizService.getRandomQuestion(this.sessionId);
      
      if (!questionData) {
        throw new Error('No question data received');
      }

      const clueText = questionData.clue && typeof questionData.clue === 'object' 
        ? (questionData.clue.clue || 'No clue text available')
        : (typeof questionData.clue === 'string' ? questionData.clue : 'No clue provided');

      this.currentQuestion = {
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
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  };

  submitAnswer = async (selectedOption) => {
    try {
      const selectedOptionIndex = this.currentQuestion.options.findIndex(opt => opt.text === selectedOption);
      const selectedOptionData = this.currentQuestion.options[selectedOptionIndex];
      
      const result = await quizService.submitAnswer(
        this.sessionId,
        this.currentQuestion.id,
        selectedOptionData.id
      );

      if (result.isCorrect) {
        this.score += 1;
      }

      this.questionCount += 1;

      return {
        isCorrect: result.isCorrect,
        funFact: result.funFact,
        trivia: result.trivia,
        correctAnswerIndex: this.currentQuestion.correctAnswer
      };
    } catch (error) {
      this.setError(error.message);
      return null;
    }
  };

  handleNextQuestion = async () => {
    if (this.questionCount >= this.totalQuestions) {
      this.showResults = true;
      this.gameStarted = false;
    } else {
      await this.fetchNextQuestion();
    }
  };

  resetGame = () => {
    this.sessionId = null;
    this.currentQuestion = null;
    this.loading = false;
    this.error = null;
    this.gameStarted = false;
    this.showResults = false;
    this.score = 0;
    this.questionCount = 0;
    this.challengerScore = null;
    this.isChallenge = false;
    this.challengeId = null;
    this.inviteLink = null;
  };
}

export const quizStore = new QuizStore(); 