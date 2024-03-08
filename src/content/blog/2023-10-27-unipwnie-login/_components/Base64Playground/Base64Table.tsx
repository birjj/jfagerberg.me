import type { JSX } from "preact/jsx-runtime";
import { fromBits, mapPadded, toBits } from "./utils";

const Base64Table = ({
  value,
  ...props
}: JSX.IntrinsicElements["table"] & { value: string }) => {
  const bits = toBits(value);
  const encoded = fromBits(bits);

  return (
    <div className="max-w-full overflow-x-auto">
      <table
        className={`${
          props.className || ""
        } text-center border not-prose text-sm border-slate-400/50 dark:border-slate-600/50`}
      >
        <tbody>
          <InputRow value={value} />
          <BitRow bits={bits} />
          <OutputRow value={encoded} />
        </tbody>
      </table>
    </div>
  );
};
export default Base64Table;

const InputRow = ({ value }: { value: string }) => {
  return (
    <>
      <tr>
        <Cell isHeader rowSpan={2} scope="row">
          Source
        </Cell>
        <Cell isHeader scope="row">
          Text (ASCII)
        </Cell>
        {mapPadded(value.split(""), 3, (c, i, _, isPadding) => (
          <Cell key={i} colSpan={8} className="border-0">
            {c}
          </Cell>
        ))}
      </tr>
      <tr>
        <Cell isHeader scope="row">
          Value
        </Cell>
        {mapPadded(value.split(""), 3, (c, i, _, isPadding) => (
          <Cell isPadding={isPadding} key={i} colSpan={8}>
            {c?.charCodeAt(0)}
          </Cell>
        ))}
      </tr>
    </>
  );
};

const BitRow = ({ bits }: { bits: string }) => {
  const paddedLength = Math.ceil(bits.length / 6) * 6;
  return (
    <tr>
      <Cell isHeader colSpan={2} scope="row">
        Bits
      </Cell>
      {mapPadded(bits.split(""), 24, (b, i, _, isPadding) => (
        <Cell isPadding={isPadding} key={i}>
          {isPadding ? (i < paddedLength ? "0" : "\xa0" /* &nbsp */) : b}
        </Cell>
      ))}
    </tr>
  );
};

const OutputRow = ({ value }: { value: string }) => {
  const valueCodes = value.split("").map((v) => v.charCodeAt(0));
  return (
    <>
      <tr>
        <Cell isHeader rowSpan={2} scope="row">
          Base64
          <br />
          encoded
        </Cell>
        <Cell isHeader scope="row">
          Value
        </Cell>
        {mapPadded(valueCodes, 4, (v, i, _, isPadding) => (
          <Cell isPadding={isPadding} key={i} colSpan={6}>
            {isPadding ? "Padding" : v}
          </Cell>
        ))}
      </tr>
      <tr>
        <Cell isHeader scope="row">
          Character
        </Cell>
        {mapPadded(value.split(""), 4, (c, i, _, isPadding) => (
          <Cell className="border-0" key={i} colSpan={6}>
            {c || "="}
          </Cell>
        ))}
      </tr>
    </>
  );
};

const Cell = (
  props: JSX.IntrinsicElements["td"] & {
    isHeader?: boolean;
    isPadding?: boolean;
  },
) => {
  const { className = "", isHeader, isPadding, ...rest } = props;
  const fullClass = `${className} ${
    isPadding ? "bg-slate-400/10 text-center" : ""
  } ${isHeader ? "bg-slate-400/25 font-bold" : "font-mono"} ${
    !isPadding && !isHeader ? "bg-white dark:bg-black" : ""
  } border border-slate-400/50 dark:border-slate-600/50 py-[0.2em] px-[0.4em]`;
  return isHeader ? (
    <th {...rest} className={fullClass} />
  ) : (
    <td {...rest} className={fullClass} />
  );
};
