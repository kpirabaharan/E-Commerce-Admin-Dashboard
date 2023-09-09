'use client';

import { useState, useEffect } from 'react';

export const useColors = () => {
  const [isMounted, setIsMounted] = useState(false);

  const colors =
    typeof window != 'undefined'
      ? [
          {
            name: 'zinc',
            value: '#52525b',
          },
          {
            name: 'slate',
            value: '#485569',
          },
          {
            name: 'stone',
            value: '#58534e',
          },
          {
            name: 'gray',
            value: '#4b5563',
          },
          {
            name: 'neutral',
            value: '#525252',
          },
          {
            name: 'red',
            value: '#dd2626',
          },
          {
            name: 'rose',
            value: '#e11d49',
          },
          {
            name: 'orange',
            value: '#ea580b',
          },
          {
            name: 'green',
            value: '#22c65f',
          },
          {
            name: 'blue',
            value: '#3b82f6',
          },
          {
            name: 'yellow',
            value: '#facc16',
          },
          {
            name: 'violet',
            value: '#6d28d9',
          },
        ]
      : [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return [];
  }

  return colors;
};
