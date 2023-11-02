/** Taken from https://usehooks-ts.com/react-hook/use-local-storage */
import {
  type StateUpdater,
  useCallback,
  useEffect,
  useState,
} from "preact/hooks";

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  supportSSR = true
): [T, StateUpdater<T>] {
  // Get from local storage then parse stored JSON or return initialValue
  const readValue = useCallback((): T => {
    // Prevent SSR "window is undefined"
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (parseJSON(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  // We use initial value as the default to support SSR
  const [storedValue, setStoredValue] = useState<T>(supportSSR ? initialValue : readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue: StateUpdater<T> = useCallback(
    (value) => {
      // Prevent build error "window is undefined" but keeps working
      if (typeof window === "undefined") {
        console.warn(
          `Tried setting localStorage key “${key}” even though environment is not a client`
        );
      }

      try {
        // Allow value to be a function so we have the same API as useState
        const newValue = value instanceof Function ? value(storedValue) : value;

        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(newValue));

        // Save state
        setStoredValue(newValue);
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [storedValue, setStoredValue, key]
  );

  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  return [storedValue, setValue];
}

// A wrapper for "JSON.parse()"" to support "undefined" value
function parseJSON<T>(value: string | null): T | undefined {
  try {
    return value === "undefined" ? undefined : JSON.parse(value ?? "");
  } catch {
    return undefined;
  }
}

export default useLocalStorage;
