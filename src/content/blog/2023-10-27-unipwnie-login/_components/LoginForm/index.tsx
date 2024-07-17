import { useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import RequirementsGrid from "./RequirementsGrid";
import requirements from "./requirements";

const LoginForm = () => {
  const [password, setPassword] = useState("");

  const onInput = (e: JSX.TargetedInputEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  return (
    <>
      <div
        className="full-size"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          marginBlockEnd: "1.75rem",
          paddingBlock: "1.75rem",
        }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          Enter password:
          <input
            style={{ fontFamily: "var(--font-mono, monospace)", width: "32ch" }}
            type="text"
            placeholder="Enter password"
            value={password}
            onInput={onInput}
          />
        </label>
        <RequirementsGrid requirements={requirements} value={password} />
      </div>
    </>
  );
};
export default LoginForm;
