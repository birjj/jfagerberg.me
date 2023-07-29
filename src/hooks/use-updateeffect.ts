/** Taken from https://usehooks-ts.com/react-hook/use-update-effect */
import {
  type EffectCallback,
  type Inputs,
  useEffect,
  useRef,
} from "preact/hooks";

function useIsFirstRender(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
}

function useUpdateEffect(effect: EffectCallback, deps?: Inputs) {
  const isFirst = useIsFirstRender();

  useEffect(() => {
    if (!isFirst) {
      return effect();
    }
  }, deps);
}
export default useUpdateEffect;
