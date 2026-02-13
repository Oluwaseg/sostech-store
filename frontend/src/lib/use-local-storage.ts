'use client';

import { useEffect, useState } from 'react';

/**
 * Generic, type-safe localStorage state hook
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}"`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}"`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
