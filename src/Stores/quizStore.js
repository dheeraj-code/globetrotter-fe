import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import quizService from '../Services/quizService';
import challengeService from '../Services/challengeService';

export const useQuizStore = create(
  persist(
    (set, get) => ({
      // State
      sessionId: null,
      currentQuestion: null,
      loading: false,
      error: null,
      gameStarted: false,
      showResults: false,
      score: 0,
      questionCount: 0,
      totalQuestions: 5,
      challengerScore: null,
      isChallenge: false,
      challengeId: null,
      inviteLink: null,

      // Actions
      setLoading: (status) => set({ loading: status }),
      setError: (error) => set({ error }),

      resetGame: (clearLoading = true) => {
        const resetState = {
          sessionId: null,
          currentQuestion: null,
          error: null,
          gameStarted: false,
          showResults: false,
          score: 0,
          questionCount: 0,
          challengerScore: null,
          isChallenge: false,
          challengeId: null,
          inviteLink: null,
          loading: clearLoading ? false : get().loading,
        };
        set(resetState);
        localStorage.removeItem('quiz-storage'); // clear persisted state
      },

      startNewSession: async () => {
        const { setLoading, setError, resetGame } = get();
        setLoading(true);
        setError(null);
        resetGame(false);

        try {
          const newSessionId = await quizService.startQuizSession();
          set({
            sessionId: newSessionId,
            gameStarted: true,
          });
          await get().fetchNextQuestion();
        } catch (error) {
          console.error(error);
          setError(error.message || 'Failed to start session');
        } finally {
          setLoading(false);
        }
      },

      fetchNextQuestion: async () => {
        const { sessionId, setLoading, setError } = get();
        setLoading(true);
        try {
          const questionData = await quizService.getRandomQuestion(sessionId);
          if (!questionData) throw new Error('No question data received');

          const clueText =
            typeof questionData.clue === 'object'
              ? questionData.clue.clue || 'No clue text available'
              : questionData.clue || 'No clue provided';

          const options = Array.isArray(questionData.options)
            ? questionData.options.map((opt, index) => ({
                id: opt.id || index,
                text: opt.city && opt.country ? `${opt.city}, ${opt.country}` : 'Unknown location',
                index,
              }))
            : [];

          set({
            currentQuestion: {
              id: questionData.id,
              question: clueText,
              options,
              correctAnswer: questionData.options.findIndex((opt) => opt.id === questionData.cityId),
            },
          });
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      },

      submitAnswer: async (selectedOptionText) => {
        const { currentQuestion, sessionId } = get();
        try {
          const selectedIndex = currentQuestion.options.findIndex(
            (opt) => opt.text === selectedOptionText
          );
          const selectedOption = currentQuestion.options[selectedIndex];
          const result = await quizService.submitAnswer(
            sessionId,
            currentQuestion.id,
            selectedOption.id,
            selectedOption.id === currentQuestion.correctAnswer
          );

          console.log(result)

          set({ score: result.score });

          return {
            isCorrect: selectedOption.id === currentQuestion.correctAnswer,
            funFact: result.funFact,
            trivia: result.trivia,
            correctAnswerIndex: currentQuestion.correctAnswer,
          };
        } catch (error) {
          get().setError(error.message);
          return null;
        }
      },

      handleNextQuestion: async () => {
        const { questionCount, totalQuestions } = get();
        set({ questionCount: questionCount + 1 });

        if (questionCount + 1 >= totalQuestions) {
          set({
            showResults: true,
            gameStarted: false,
            currentQuestion: null,
          });
        } else {
          await get().fetchNextQuestion();
        }
      },

      createChallenge: async () => {
        const { sessionId, setLoading, setError } = get();
        setLoading(true);
        setError(null);

        try {
          if (!sessionId) throw new Error('No active quiz session found');
          const result = await challengeService.createChallenge(sessionId);
          if (!result?.inviteLink) throw new Error('Invalid server response: missing invite link');

          set({
            challengeId: result.id,
            inviteLink: result.inviteLink,
          });

          return result;
        } catch (error) {
          setError(error.message);
          throw error;
        } finally {
          setLoading(false);
        }
      },

      getChallengeInfo: async (inviteLink) => {
        const { setLoading, setError, totalQuestions } = get();
        setLoading(true);
        try {
          const challenge = await challengeService.getChallengeByLink(inviteLink);
          if (challenge.isOwnChallenge) throw new Error('Cannot accept your own challenge');
          if (challenge.isAlreadyAccepted) throw new Error('Challenge already accepted');

          return {
            inviterScore: challenge.inviter_score ?? 0,
            totalQuestions,
            id: challenge.id,
          };
        } catch (error) {
          setError(error.message);
          throw error;
        } finally {
          setLoading(false);
        }
      },

      startChallenge: async (inviteLink) => {
        const { setLoading, setError } = get();
        setLoading(true);

        try {
          const challenge = await challengeService.getChallengeByLink(inviteLink);
          if (challenge.isOwnChallenge) throw new Error('Cannot accept your own challenge');
          if (challenge.isAlreadyAccepted) throw new Error('Challenge already accepted');

          const result = await challengeService.acceptChallenge(inviteLink);

          set({
            sessionId: result.quizSession.id,
            challengerScore: challenge.inviter_score ?? 0,
            isChallenge: true,
            challengeId: challenge.id,
            gameStarted: true,
          });

          await get().fetchNextQuestion();
          return challenge;
        } catch (error) {
          setError(error.message);
          throw error;
        } finally {
          setLoading(false);
        }
      },

      // Computed
      get currentQuestionNumber() {
        return get().questionCount + 1;
      },
      get isLastQuestion() {
        return get().currentQuestionNumber === get().totalQuestions;
      },
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        score: state.score,
        sessionId: state.sessionId,
        challengeId: state.challengeId,
        inviteLink: state.inviteLink,
        isChallenge: state.isChallenge,
        challengerScore: state.challengerScore,
      }),
    }
  )
);
