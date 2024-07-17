import { useRef, useState } from "preact/hooks";
import type { Requirement } from "./requirements";
import ResultView from "./ResultView";

const RequirementsGrid = ({
  value,
  requirements,
}: {
  value: string;
  requirements: Requirement[];
}) => {
  const [showAll, setShowAll] = useState(false);

  const results = requirements.map(({ test }) => test(value));
  // we only show a requirement if it's been the first failing requirement at least once
  const shouldShow = useRef<boolean[]>([]);
  for (let i = 0; i < results.length; ++i) {
    shouldShow.current[i] = true;
    if (results[i].valid === false) {
      break;
    }
  }
  const numLeftToShow = results.length - shouldShow.current.length;

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          rowGap: "0.4rem",
          columnGap: "1ch",
          marginBlock: "1rem",
          width: "100%",
        }}
      >
        {requirements.map((req, i) => (
          <ResultView
            key={i}
            text={req.text}
            result={results[i]}
            show={showAll || shouldShow.current[i]}
          />
        ))}
        <p
          style={{
            fontSize: "0.85rem",
            visibility: numLeftToShow === 0 || showAll ? "hidden" : "",
            margin: "0",
          }}
        >
          <em>
            ({numLeftToShow} requirements left to reveal;{" "}
            {numLeftToShow === 0 ? (
              "nice work!)"
            ) : (
              <>
                <a
                  onClick={() => setShowAll(!showAll)}
                  style={{
                    cursor: "pointer",
                    background: "none",
                    fontWeight: "600",
                  }}
                >
                  click here
                </a>{" "}
                to {showAll ? "try on your own" : "show them all"})
              </>
            )}
          </em>
        </p>
      </div>
    </>
  );
};
export default RequirementsGrid;
