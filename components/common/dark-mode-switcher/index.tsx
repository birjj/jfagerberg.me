import React, { useEffect, useState } from "react";
import useLocalStorage from "../../../hooks/use-local-storage";
import useMedia from "../../../hooks/use-media";

import style from "./index.module.css";

const DarkModeSwitcher = () => {
  const prefersLight = useMedia("(prefers-color-scheme: light)");
  const [isLight, setLight] = useLocalStorage("light-mode", prefersLight);

  useEffect(() => {
    document.body.classList.toggle("light", isLight);
    document.body.classList.toggle("dark", !isLight);
  }, [isLight]);

  return (
    <button
      className={style.button}
      onClick={() => setLight(!isLight)}
      aria-label="Toggle dark mode"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`${style.container} ${isLight ? style.light : style.dark}`}
        strokeLinecap="round"
        strokeWidth={2}
        stroke="currentColor"
      >
        <mask id="dark-mode__mask">
          <rect x="0" y="0" width="24" height="24" fill="#fff" stroke="none" />
          <circle
            className={style.mask}
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
          className={style.sun}
          fill="currentColor"
          stroke="none"
          mask="url(#dark-mode__mask)"
        />
        <g className={style.rays}>
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
  );
};
export default DarkModeSwitcher;
