import { useRef } from "preact/hooks";

export default function useIsFirstRender() {
  const isFirstRenderRef = useRef(true);
  const isFirstRender = isFirstRenderRef.current;
  isFirstRenderRef.current = false;
  return isFirstRender;
}