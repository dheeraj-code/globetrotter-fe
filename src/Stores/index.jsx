import { useAuthStore } from './authStore';
import { useQuizStore } from './quizStore';

export const useRootStore = () => ({
  auth: useAuthStore(),
  quiz: useQuizStore(),
});
