import { MutableRefObject, useEffect, useRef, useState } from "react";

/**
 * Hook for getting the value of a @media query, e.g. "(prefers-color-scheme: dark)"
 * The returned value is updated if the match ever changes
 */
export default function useMedia(mediaStr: string) {
  const match: MutableRefObject<MediaQueryList | null> = useRef(null);
  useEffect(() => {
    match.current =
      typeof window !== "undefined" &&
      "matchMedia" in window &&
      window.matchMedia
        ? window.matchMedia(mediaStr)
        : null;
  }, []);
  const [value, setValue] = useState(match.current?.matches || false);

  useEffect(() => {
    if (!match.current) {
      return;
    }

    const listener = () => {
      setValue(match.current?.matches || false);
    };
    match.current.addEventListener("change", listener);
    return () => match.current?.removeEventListener("change", listener);
  }, [match, mediaStr]);

  return value;
}
