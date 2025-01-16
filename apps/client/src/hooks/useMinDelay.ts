import { useState, useEffect } from 'react';

export function useMinDelay(loading: boolean, delayMs: number = 1000) {
  const [showLoading, setShowLoading] = useState(loading);

  useEffect(() => {
    if (loading) {
      setShowLoading(true);
    }

    if (!loading && showLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, delayMs);

      return () => clearTimeout(timer);
    }
  }, [loading, delayMs, showLoading]);

  return showLoading;
} 