import { useState, useEffect } from 'react';

/**
 * Custom debounce hook
 * Defers updating the debounced value until after `delay` milliseconds have elapsed
 * since the last time the value was modified.
 * 
 * @param {any} value The value to debounce (e.g. search query string)
 * @param {number} delay Milliseconds to wait (defaults to 400ms)
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Schedule update after specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timeout if value or delay changes before timeout fires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
