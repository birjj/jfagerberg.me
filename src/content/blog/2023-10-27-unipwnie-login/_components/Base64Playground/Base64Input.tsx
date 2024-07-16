import { useCallback } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

const Base64Input = (
  props: JSX.IntrinsicElements["input"] & { onUpdate: (v: string) => void },
) => {
  const { onUpdate, className = "", ...rest } = props;

  const onInput: JSX.GenericEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const value = e.currentTarget?.value || "";
      console.log("Setting value to", value.substring(0, 3));
      onUpdate(value.substring(0, 3));
    },
    [onUpdate],
  );

  return (
    <input
      type="text"
      {...rest}
      maxLength={3}
      onInput={onInput}
      className={`${className} w-[3ch] box-content font-mono flex items-center text-left mx-4 px-4 py-1.5 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-accent-500 shadow-sm rounded-lg dark:bg-slate-800 dark:ring-0 dark:highlight-white/5 dark:hover:bg-slate-700`}
    />
  );
};
export default Base64Input;
