import { useCallback } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

const Base64Input = (
  props: JSX.IntrinsicElements["input"] & { onUpdate: (v: string) => void },
) => {
  const { onUpdate, ...rest } = props;

  const onInput: JSX.GenericEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const value = e.currentTarget?.value || "";
      onUpdate(value.substring(0, 9));
    },
    [onUpdate],
  );

  return (
    <input
      type="text"
      {...rest}
      maxLength={9}
      onInput={onInput}
      style={{
        width: "9ch",
        fontFamily: "var(--font-mono, monospace)",
        display: "flex",
        alignItems: "center",
        textAlign: "left",
        marginInline: "1rem",
        boxSizing: "content-box",
      }}
    />
  );
};
export default Base64Input;
