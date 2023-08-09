import type { ComponentChildren } from "preact";
import { useEffect, useId, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import useDarkMode from "../hooks/use-darkmode";

export type DarkModeToggleProps = JSX.IntrinsicElements["div"] & {};
const DarkModeToggle = ({ ...props }: DarkModeToggleProps) => {
  const id = useId();
  const { isDarkMode, toggle } = useDarkMode(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const title = isDarkMode ? `Switch to light mode` : `Switch to dark mode`;

  return (
    <div {...props}>
      <button
        class={`h-full px-2 items-center flex justify-center`}
        type="button"
        onClick={toggle}
        title={title}
        aria-label={title}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-5 h-5"
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
              class={`transition-transform duration-300 origin-center ease-[cubic-bezier(0.2,1,1,1.4)] ${
                isDarkMode ? "" : "origin-[75%_25%] scale-0"
              }`}
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
            class={`transition-transform duration-300 origin-center ease-[cubic-bezier(0.16,1.24,0.7,1.42)] ${
              isDarkMode ? "scale-[2]" : "scale-100"
            }`}
            fill={isDarkMode ? "currentColor" : "none"}
            stroke={isDarkMode ? "none" : "currentColor"}
            mask={`url(#${id})`}
          />
          <g
            class={`transition-transform duration-300 origin-center ${
              isDarkMode
                ? "scale-0 ease-[cubic-bezier(0,1,0,1)]"
                : "scale-1 delay-100 ease-[cubic-bezier(0.2,1,1,1.4)]"
            }`}
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
