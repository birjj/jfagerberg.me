import { h, Fragment } from "preact";
import { useEffect, useId, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import useDarkMode from "../../hooks/use-darkmode";
import useIsFirstRender from "../../hooks/use-isfirstrender";

// Read the actual dark mode state from the DOM synchronously
// This is set by the inline script in BaseLayout before this component loads
// During SSR, default to true (dark mode) to match the most common case
const getInitialDarkMode = (): boolean => {
  if (typeof document === 'undefined') return true; // SSR default
  return document.documentElement.classList.contains('dark');
};

export type DarkModeToggleProps = JSX.IntrinsicElements["div"] & {};
const DarkModeToggle = ({ ...props }: DarkModeToggleProps) => {
  const id = useId();
  const { isDarkMode, toggle } = useDarkMode(getInitialDarkMode());
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    if (isFirstRender) { return; } // applying the localstorage state on first render is handled elsewhere, to avoid FOUC
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.setAttribute("data-theme", isDarkMode ? "github-dark" : "github-light");
  }, [isDarkMode, isFirstRender]);

  const title = isDarkMode ? `Switch to light mode` : `Switch to dark mode`;

  return (
    <div {...props}>
      <button
        style={{
          height: "100%",
          paddingBlock: "0.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          color: "inherit"
        }}
        type="button"
        onClick={toggle}
        title={title}
        aria-label={title}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="1.25rem"
          height="1.25rem"
          stroke-linecap="round"
          stroke-width={2}
          stroke="currentColor"
        >
          <mask id={id}>
            <rect
              x="0"
              y="0"
              width="24"
              height="24"
              fill="#fff"
              stroke="none"
            />
            <circle
              style={{
                transitionProperty: "transform",
                transitionDuration: "300ms",
                transitionTimingFunction: "cubic-bezier(0.2,1,1,1.4)",
                transformOrigin: isDarkMode ? "center" : "75% 25%",
                transform: isDarkMode ? "scale(1)" : "scale(0)"
              }}
              cx="14.5"
              cy="9.5"
              r="4"
              fill="#000"
              stroke="none"
            />
          </mask>
          <circle
            cx="12"
            cy="12"
            r="5"
            style={{
              transitionProperty: "transform",
              transitionDuration: "300ms",
              transitionTimingFunction: "cubic-bezier(0.16,1.24,0.7,1.42)",
              transformOrigin: "center",
              transform: isDarkMode ? "scale(2)" : "scale(1)"
            }}
            fill={isDarkMode ? "currentColor" : "none"}
            stroke={isDarkMode ? "none" : "currentColor"}
            mask={`url(#${id})`}
          />
          <g
            style={{
              transitionProperty: "transform",
              transitionDuration: "300ms",
              transitionDelay: isDarkMode ? null : "100ms",
              transitionTimingFunction: isDarkMode ? "cubic-bezier(0,1,0,1)" : "cubic-bezier(0.2,1,1,1.4)",
              transformOrigin: "center",
              transform: isDarkMode ? "scale(0)" : "scale(1)",

            }}
          >
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      </button>
    </div>
  );
};
export default DarkModeToggle;
