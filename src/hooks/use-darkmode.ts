/** Taken from https://usehooks-ts.com/react-hook/use-dark-mode */
import { useLayoutEffect, useState } from "preact/hooks";
import useMediaQuery from "./use-mediaquery";
import useUpdateEffect from "./use-updateeffect";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
const STORAGE_KEY = "dark-mode";

interface UseDarkModeOutput {
  isDarkMode: boolean;
  toggle: () => void;
  setDarkMode: () => void;
  setLightMode: () => void;
}

function useDarkMode(): UseDarkModeOutput {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);
  
  // Always use false as initial value for both SSR and client to avoid hydration mismatch
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Use useLayoutEffect to update to actual value before first paint
  // This reads from localStorage (preferred) or falls back to OS preference
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        // localStorage exists, use it (it's the user's explicit choice)
        setIsDarkMode(stored === "true");
      } else {
        // No localStorage, use OS preference
        const prefersDark = window.matchMedia(COLOR_SCHEME_QUERY).matches;
        setIsDarkMode(prefersDark);
        // Save the OS preference to localStorage for consistency
        window.localStorage.setItem(STORAGE_KEY, String(prefersDark));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${STORAGE_KEY}":`, error);
    }
  }, []);

  // Update darkMode if os preference changes (but only if user hasn't explicitly set a preference)
  useUpdateEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // Only update if there's no explicit user choice in localStorage
      if (stored === null) {
        setIsDarkMode(isDarkOS);
        window.localStorage.setItem(STORAGE_KEY, String(isDarkOS));
      }
    } catch (error) {
      console.warn(`Error updating dark mode:`, error);
    }
  }, [isDarkOS]);

  const setDarkModeWithStorage = (value: boolean) => {
    setIsDarkMode(value);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, String(value));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${STORAGE_KEY}":`, error);
    }
  };

  return {
    isDarkMode,
    toggle: () => setDarkModeWithStorage(!isDarkMode),
    setDarkMode: () => setDarkModeWithStorage(true),
    setLightMode: () => setDarkModeWithStorage(false),
  };
}
export default useDarkMode;
