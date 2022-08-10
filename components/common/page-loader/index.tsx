import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./index.module.css";

const PageLoader = () => {
  const [shown, setShown] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const increment = useRef(() => {});
  increment.current = useCallback(() => {
    const max = 0.994;
    const rate = 0.05;
    const step = Math.max(0, Math.random() * rate * (max - progress));
    setProgress(Math.min(Math.max(progress + step, 0.1), max));
  }, [progress, setProgress]);

  useEffect(() => {
    let timeout = 0;
    const trickle = () => {
      clearTimeout(timeout);
      increment.current();
      timeout = setTimeout(trickle, Math.random() * 800) as unknown as number;
    };
    const onStart = () => {
      setShown(true);
      setProgress(0);
      trickle();
    };
    const onStop = () => {
      setProgress(1);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShown(false);
      }, 200) as unknown as number;
    };
    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onStop);
    router.events.on("routeChangeError", onStop);
    if (shown) {
      trickle();
    }

    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onStop);
      router.events.off("routeChangeError", onStop);
      clearTimeout(timeout);
    };
  }, [router, setProgress, setShown, increment]);

  return (
    <figure
      className={[style.loader, shown ? style.active : ""].join(" ")}
      style={
        {
          "--progress": `${(progress * 100).toFixed(1)}%`,
        } as React.CSSProperties
      }
    />
  );
};
export default PageLoader;
