const getApiBaseUrl = () => {
  // For development
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  
  // For production
  return import.meta.env.VITE_API_BASE_URL || 'https://api.globetrotter.com';
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
  endpoints: {
    auth: '',
    quiz: '/quiz',
    challenge: '/challenge'
  }
}; 