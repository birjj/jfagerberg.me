import { useCallback, useEffect, useState } from "react";

/**
 * Like useState, but with localStorage store
 * Yoinked from https://usehooks-ts.com/react-hook/use-local-storage
 */
export default function useLocalStorage<T>(key: string, initialValue: T) {
  /** Reads the current value from storage */
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (parseJSON(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);

      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState(initialValue);

  /** Writes the given value to storage */
  const setValue = useCallback(
    (value: T) => {
      if (typeof window == "undefined") {
        return;
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [setStoredValue]
  );

  /** Write the initial value to storage */
  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  /** Handle storage updates */
  useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.key !== key) {
        return;
      }
      setStoredValue(readValue());
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, [key, readValue]);

  return [storedValue, setValue] as const;
}

/** Proxy for JSON.parse to support `undefined` */
function parseJSON<T>(value: string | null): T | undefined {
  try {
    return value === "undefined" ? undefined : JSON.parse(value ?? "");
  } catch {
    return undefined;
  }
}
