import { useEffect } from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';

export function useNavigationBlocker(shouldBlock, onBlock) {
  const navigate = useNavigate();

  useBlocker(
    ({ currentLocation, nextLocation }) => {
      if (shouldBlock && currentLocation.pathname !== nextLocation.pathname) {
        onBlock(() => navigate(nextLocation));
        return true;
      }
      return false;
    }
  );

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (shouldBlock) {
        e.preventDefault();
        e.returnValue = '';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldBlock]);
} 