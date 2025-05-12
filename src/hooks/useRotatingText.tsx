
import { useState, useEffect } from 'react';

export const useRotatingText = (texts: string[], interval: number = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsAnimating(false);
      }, 500); // Animation duration before changing text
    }, interval);
    
    return () => clearInterval(timer);
  }, [texts, interval]);
  
  return { 
    currentText: texts[currentIndex],
    isAnimating
  };
};
