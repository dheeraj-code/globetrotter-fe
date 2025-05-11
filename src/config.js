 const getApiBaseUrl = () => {
  // For development
  if (import.meta.env.DEV) {
    return 'http://localhost:8080';
  }
  
  // For production
  return import.meta.env.VITE_API_BASE_URL || 'https://globetrotter-dheeraj-9e159f95261e.herokuapp.com';
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
  endpoints: {
    auth: '/auth',
    quiz: '/quiz',
    challenge: '/challenge'
  },
  appBaseUrl: "https://gleeful-gingersnap-375dcd.netlify.app"
}; 