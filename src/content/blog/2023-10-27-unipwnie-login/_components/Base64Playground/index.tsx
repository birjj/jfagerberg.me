import { useState } from "preact/hooks";
import Base64Table from "./Base64Table";
import Base64Input from "./Base64Input";

const Base64Playground = () => {
  const [value, setValue] = useState("Ma");

  return (
    <>
      <label class="flex flex-row items-center justify-center">
        Enter value to see Base64 encoding:
        <Base64Input value={value} onUpdate={setValue} />
      </label>

      <div className="flex flex-col justify-center expand-width">
        <Base64Table value={value} className="shadow-md" />
      </div>
    </>
  );
};
export default Base64Playground;
