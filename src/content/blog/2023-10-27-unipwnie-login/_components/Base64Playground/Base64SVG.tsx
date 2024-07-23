import { Fragment, type JSX } from "preact/jsx-runtime";
import { toBits } from "./utils";

const BIT_CHAR_WIDTH = 8;
const SOURCE_CHAR_WIDTH = 8 * BIT_CHAR_WIDTH;
const OUTPUT_CHAR_WIDTH = 6 * BIT_CHAR_WIDTH;
const TRIPLET_WIDTH = 3 * SOURCE_CHAR_WIDTH;
const TRIPLET_MARGIN = 16;
const CANVAS_PADDING = 8;

const Base64SVG = ({
  value,
  ...props
}: JSX.IntrinsicElements["svg"] & { value: string }) => {
  const totalWidth = 3 * (TRIPLET_WIDTH + TRIPLET_MARGIN) + CANVAS_PADDING;
  return (
    <div style={{ maxWidth: "100%", overflowX: "auto", fontSize: "0.9rem" }}>
      <svg {...props} viewBox={`${0} 0 ${totalWidth} 88`}>
        <defs>
          <style class="style-fonts">{`
          @font-face {
            font-family: "Virgil";
            src: url("https://excalidraw.com/Virgil.woff2");
          }
          @font-face {
            font-family: "Cascadia";
            src: url("https://excalidraw.com/Cascadia.woff2");
          }
          @font-face {
            font-family: "Assistant";
            src: url("https://excalidraw.com/Assistant-Regular.woff2");
          }
        `}</style>
        </defs>
        <Base64Triplet value={value.substring(0, 3)} x={CANVAS_PADDING} />
        <Base64Triplet
          value={value.substring(3, 6)}
          x={CANVAS_PADDING + TRIPLET_WIDTH + TRIPLET_MARGIN}
        />
        <Base64Triplet
          value={value.substring(6, 9)}
          x={CANVAS_PADDING + 2 * (TRIPLET_WIDTH + TRIPLET_MARGIN)}
        />
      </svg>
    </div>
  );
};
export default Base64SVG;

const Base64Triplet = ({
  value,
  x = 0,
  y = 0,
}: {
  value: string;
  x?: number;
  y?: number;
}) => {
  const encoded = btoa(value);
  const bits = toBits(value).padEnd(24, "0");
  if (!value) {
    return null;
  }
  return (
    <g class="triplet" transform={`translate(${x} ${y})`}>
      {value.split("").map((char, i) => {
        const sourceX = i * SOURCE_CHAR_WIDTH;
        return (
          <g className="source-char" key={`${i}-${char}`}>
            <text
              x={sourceX + SOURCE_CHAR_WIDTH / 2 - BIT_CHAR_WIDTH / 2}
              y={16}
              font-size={16}
              fill={"currentColor"}
              font-family="Cascadia, Segoe UI Emoji"
              text-anchor="middle"
            >
              {char}
            </text>
            <path
              d={`M${sourceX - BIT_CHAR_WIDTH / 2 + 2},32v-4h${SOURCE_CHAR_WIDTH - 4}v4m-${SOURCE_CHAR_WIDTH / 2 - 2},-4v-4`}
              stroke="currentColor"
              fill="none"
            />
          </g>
        );
      })}
      <g class="bits">
        {bits
          .substring(0, Math.ceil((value.length * 8) / 6) * 6)
          .split("")
          .map((bit, i) => (
            <text
              key={`${i}-${bit}`}
              x={BIT_CHAR_WIDTH * i}
              y={46}
              font-size={12}
              fill={
                i >= value.length * 8
                  ? "var(--c-text-secondary)"
                  : "currentColor"
              }
              font-family="Cascadia, Segoe UI Emoji"
              text-anchor="middle"
            >
              {bit}
            </text>
          ))}
      </g>
      {encoded.split("").map((char, i) => {
        const encodedX = i * OUTPUT_CHAR_WIDTH;
        return (
          <g className="output-char" key={`${i}-${char}`}>
            <text
              x={encodedX + OUTPUT_CHAR_WIDTH / 2 - BIT_CHAR_WIDTH / 2}
              y={52 + 4 + 8 + 16}
              font-size={16}
              fill={"currentColor"}
              font-family="Cascadia, Segoe UI Emoji"
              text-anchor="middle"
            >
              {char}
            </text>
            <path
              d={`M${encodedX - BIT_CHAR_WIDTH / 2 + 2},52v4h${OUTPUT_CHAR_WIDTH - 4}v-4m-${OUTPUT_CHAR_WIDTH / 2 - 2},4v4`}
              stroke="currentColor"
              fill="none"
            />
          </g>
        );
      })}
    </g>
  );
};
