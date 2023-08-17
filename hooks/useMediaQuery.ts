import { useState, useEffect } from 'react';

const useMediaQuery = (query: string) => {
  const [isMatches, setIsMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== isMatches) {
      setIsMatches(media.matches);
    }
    const listener = () => setIsMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [isMatches, query]);

  return isMatches;
};

export default useMediaQuery;
