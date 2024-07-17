import { useRef, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

type Requirement = {
  text: string;
  test: (v: string) => { valid: boolean; descriptor?: string };
};
const requirements: Requirement[] = [
  {
    text: "Must contain an uppercase letter",
    test: (v) => ({ valid: /[A-Z]/.test(v) }),
  },
  {
    text: "Must contain a lowercase letter",
    test: (v) => ({ valid: /[a-z]/.test(v) }),
  },
  {
    text: "Must contain a digit",
    test: (v) => ({ valid: /[0-9]/.test(v) }),
  },
  {
    text: "Must contain a symbol",
    test: (v) => ({ valid: /[!"#$%&'()*+,\-.\/:;<=>?@\[\]\\^_`{|}~]/.test(v) }),
  },
  {
    text: "Must contain a Roman numeral (CDILMVX)",
    test: (v) => ({ valid: /[CDILMNVX]/i.test(v) }),
  },
  {
    text: "Must contain at least 8 unique characters",
    test: (v) => ({ valid: new Set(v).size >= 8 }),
  },
  {
    text: "Must be between 10 and 20 characters long",
    test: (v) => ({ valid: v.length >= 10 && v.length <= 20 }),
  },
  {
    text: "Must contain an unbroken sequence of letters of length 5",
    test: (v) => {
      let running = 0;
      for (let i = 0; i < v.length; ++i) {
        if (/[a-z]/i.test(v[i])) {
          ++running;
          if (running >= 5) break;
        } else {
          running = 0;
        }
      }
      return {
        valid: running >= 5,
      };
    },
  },
  {
    text: "Sum of all digits must be a cube number",
    test: (v) => {
      const sum = v
        .split("")
        .filter((v) => /\d/.test(v))
        .reduce((p, v) => p + +v, 0);
      const root = Math.pow(sum, 1 / 3);
      return {
        valid: Math.abs(root - Math.round(root)) < 1e-10, // arbitrary precision to account for floating point errors
        descriptor: `sum is ${sum}`,
      };
    },
  },
  {
    text: "Must be a palindrome",
    test: (v) => ({ valid: v === v.split("").reverse().join("") }),
  },
  {
    text: "Base64 encoding must contain only lowercase letters",
    test: (v) => {
      const encoding = btoa(v);
      return {
        valid: /^[a-z]*$/.test(encoding),
        descriptor: encoding,
      };
    },
  },
];

const RequirementView = ({
  value,
  requirement,
}: {
  value: string;
  requirement: Requirement;
}) => {
  const result = requirement.test(value);
  return (
    <p
      style={{
        margin: "0",
        color: result.valid ? "var(--c-text-secondary)" : "red",
        fontSize: "0.9rem",
      }}
    >
      {requirement.text}
      {result.descriptor ? ` (${result.descriptor})` : ""}
    </p>
  );
};
const RequirementsView = ({
  value,
  showAll,
  requirements,
}: {
  value: string;
  showAll: boolean;
  requirements: Requirement[];
}) => {
  if (showAll) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          rowGap: "0.1rem",
          marginBlock: "1rem",
        }}
      >
        {requirements.map((req, i) => (
          <RequirementView key={i} value={value} requirement={req} />
        ))}
      </div>
    );
  }

  // if we aren't showing all, we only show the first failing requirement
  for (const requirement of requirements) {
    if (!requirement.test(value).valid) {
      return (
        <div style={{ marginBlock: "1rem" }}>
          <RequirementView value={value} requirement={requirement} />
        </div>
      );
    }
  }

  return null;
};

const LoginForm = () => {
  const [password, setPassword] = useState("");
  const [showAll, setShowAll] = useState(false);

  const onInput = (e: JSX.TargetedInputEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  return (
    <div
      className="full-size"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        marginBlockEnd: "1.75rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <input
          style={{ fontFamily: "var(--font-mono, monospace)", width: "32ch" }}
          type="text"
          placeholder="Enter password"
          value={password}
          onInput={onInput}
        />
        {showAll ? null : (
          <button
            type="button"
            onClick={() => {
              setShowAll(true);
            }}
          >
            Show all requirements
          </button>
        )}
      </div>
      <RequirementsView
        showAll={showAll}
        requirements={requirements}
        value={password}
      />
    </div>
  );
};
export default LoginForm;
