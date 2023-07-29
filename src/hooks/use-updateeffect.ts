/** Taken from https://usehooks-ts.com/react-hook/use-update-effect */
import {
  type EffectCallback,
  type Inputs,
  useEffect,
  useRef,
} from "preact/hooks";

function useUpdateEffect(effect: EffectCallback, deps?: Inputs) {
  const isFirst = useRef(true);
  if (isFirst.current) {
    isFirst.current = false;
  }

  useEffect(() => {
    if (!isFirst.current) {
      return effect();
    }
  }, deps);
}
export default useUpdateEffect;
