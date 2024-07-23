import { useState } from "preact/hooks";
import Base64Input from "./Base64Input";
import Base64SVG from "./Base64SVG";

const Base64Playground = () => {
  const [value, setValue] = useState("Ma");

  const blocks = [];
  for (let i = 0; i < value.length; i += 3) {
    blocks.push(value.substring(i, i + 3));
  }
  if (!blocks.length) {
    blocks.push("");
  }

  return (
    <div
      className="full-size"
      style={{
        marginBlockEnd: "1.75rem",
        paddingBlock: "1.75rem",
        paddingInline: "1rem",
      }}
    >
      <label
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBlockEnd: "1.75rem",
        }}
      >
        <Base64Input value={value} onUpdate={setValue} /> encodes as{" "}
        <input
          type="text"
          disabled
          value={btoa(value)}
          style={{
            fontFamily: "var(--font-mono, monospace)",
            marginInline: "1rem",
            boxSizing: "content-box",
            width: `${Math.max(12, btoa(value).length)}ch`,
          }}
        ></input>
      </label>

      <Base64SVG value={value} />
    </div>
  );
};
export default Base64Playground;
