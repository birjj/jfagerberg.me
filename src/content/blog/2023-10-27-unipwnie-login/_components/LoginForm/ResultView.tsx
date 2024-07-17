import type { Requirement } from "./requirements";

const ResultView = ({
  text,
  result,
  show = false,
}: {
  text: string;
  result: ReturnType<Requirement["test"]>;
  show?: boolean;
}) => {
  return (
    <p
      style={{
        margin: "0",
        color: result.valid ? "var(--c-text-secondary)" : "red",
        fontSize: "1rem",
        visibility: show ? "" : "hidden",
        opacity: show ? 1 : 0,
        transition: "opacity 0.5s var(--easing-default)",
      }}
    >
      {text}
      {result.descriptor && show ? ` (${result.descriptor})` : ""}
    </p>
  );
};
export default ResultView;
