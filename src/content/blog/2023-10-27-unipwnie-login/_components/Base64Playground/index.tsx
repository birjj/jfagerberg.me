import { useState } from "preact/hooks";
import Base64Table from "./Base64Table";
import Base64Input from "./Base64Input";

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
      }}
    >
      <label
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBlockEnd: "1rem",
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          gap: "1rem",
        }}
      >
        {blocks.map((block, i) => {
          return <Base64Table value={block} key={i} />;
        })}
      </div>
    </div>
  );
};
export default Base64Playground;
