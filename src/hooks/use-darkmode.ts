/** Taken from https://usehooks-ts.com/react-hook/use-dark-mode */
import useLocalStorage from "./use-localstorage";
import useMediaQuery from "./use-mediaquery";
import useUpdateEffect from "./use-updateeffect";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

interface UseDarkModeOutput {
  isDarkMode: boolean;
  toggle: () => void;
  setDarkMode: () => void;
  setLightMode: () => void;
}

function useDarkMode(defaultValue?: boolean): UseDarkModeOutput {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);
  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>(
    "dark-mode",
    defaultValue ?? isDarkOS ?? false,
    false // disable SSR support to read localStorage immediately on client
  );

  // Update darkMode if os prefers changes
  useUpdateEffect(() => {
    setDarkMode(isDarkOS);
  }, [isDarkOS]);

  return {
    isDarkMode,
    toggle: () => setDarkMode((prev) => !prev),
    setDarkMode: () => setDarkMode(true),
    setLightMode: () => setDarkMode(false),
  };
}
export default useDarkMode;
