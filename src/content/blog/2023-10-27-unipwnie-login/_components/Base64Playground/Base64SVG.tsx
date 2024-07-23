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
  const numTriplets = Math.ceil(value.length / 3);
  const actualWidth =
    numTriplets * (TRIPLET_WIDTH + TRIPLET_MARGIN * 2) + 2 * CANVAS_PADDING;
  const totalWidth =
    3 * (TRIPLET_WIDTH + TRIPLET_MARGIN * 2) + 2 * CANVAS_PADDING;
  return (
    <div style={{ maxWidth: "100%", overflowX: "auto", fontSize: "0.9rem" }}>
      <svg {...props} viewBox={`${0} 0 ${totalWidth} 128`}>
        {[...new Array(numTriplets)].map((_, tripletIndex) => {
          const tripletX =
            CANVAS_PADDING + (TRIPLET_WIDTH + TRIPLET_MARGIN) * tripletIndex;
          const start = tripletIndex * 3;
          const tripletSource = value.substring(start, start + 3);
          const tripletOutput = btoa(tripletSource);
          const tripletBits = toBits(tripletSource).padEnd(3 * 8, "0");
          return (
            <g class="triplet" key={tripletIndex}>
              {tripletSource.split("").map((char, i) => {
                const x = tripletX + i * SOURCE_CHAR_WIDTH;
                return (
                  <g className="source-char" key={`${i}-${char}`}>
                    <text
                      x={x + SOURCE_CHAR_WIDTH / 2 - BIT_CHAR_WIDTH / 2}
                      y={16}
                      font-size={16}
                      fill={"currentColor"}
                      font-family="var(--font-mono, monospace)"
                      text-anchor="middle"
                    >
                      {char}
                    </text>
                    <path
                      d={`M${x - BIT_CHAR_WIDTH / 2 + 2},32v-4h${SOURCE_CHAR_WIDTH - 4}v4m-${SOURCE_CHAR_WIDTH / 2 - 2},-4v-4`}
                      stroke="currentColor"
                      fill="none"
                    />
                  </g>
                );
              })}
              <g class="bits">
                {tripletBits.split("").map((bit, i) => (
                  <text
                    key={`${i}-${bit}`}
                    x={tripletX + BIT_CHAR_WIDTH * i}
                    y={46}
                    font-size={12}
                    fill="currentColor"
                    font-family="var(--font-mono, monospace)"
                    text-anchor="middle"
                  >
                    {bit}
                  </text>
                ))}
              </g>
              {tripletOutput.split("").map((char, i) => {
                const x = tripletX + i * OUTPUT_CHAR_WIDTH;
                return (
                  <g className="output-char" key={`${i}-${char}`}>
                    <text
                      x={x + OUTPUT_CHAR_WIDTH / 2 - BIT_CHAR_WIDTH / 2}
                      y={52 + 4 + 8 + 16}
                      font-size={16}
                      fill={"currentColor"}
                      font-family="var(--font-mono, monospace)"
                      text-anchor="middle"
                    >
                      {char}
                    </text>
                    <path
                      d={`M${x - BIT_CHAR_WIDTH / 2 + 2},52v4h${OUTPUT_CHAR_WIDTH - 4}v-4m-${OUTPUT_CHAR_WIDTH / 2 - 2},4v4`}
                      stroke="currentColor"
                      fill="none"
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
export default Base64SVG;
