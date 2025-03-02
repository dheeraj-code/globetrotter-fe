import React, { createContext, useContext } from 'react';
import { authStore } from './authStore';
import { quizStore } from './quizStore';

class RootStore {
  constructor() {
    this.authStore = authStore;
    this.quizStore = quizStore;
  }
}

const rootStore = new RootStore();

// Create a React context for the stores
const StoreContext = createContext(rootStore);

// Hook to use the stores in components
export const useStores = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return context;
};

// Store Provider component
export const StoreProvider = ({ children }) => {
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
}; 