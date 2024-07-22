import type { Requirement } from "./requirements";

const RequirementView = ({
  value,
  requirement,
  show = false,
}: {
  value: string;
  requirement: Requirement;
  show?: boolean;
}) => {
  const result = requirement.test(value);
  return (
    <p
      style={{
        margin: "0",
        color: result ? "var(--c-text-secondary)" : "var(--c-error)",
        fontSize: "1rem",
        visibility: show ? "" : "hidden",
        opacity: show ? 1 : 0,
        transition: "opacity 0.5s var(--easing-default)",
      }}
    >
      {requirement.text(value)}
    </p>
  );
};
export default RequirementView;
