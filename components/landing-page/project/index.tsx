import React from "react";

import style from "./project.module.css";

type ProjectProps = {
  icon: React.ReactNode;
  title: React.ReactNode;
  tags?: string[];
  url: string;
};

const Project = ({
  icon,
  title,
  tags = [],
  url,
  children,
}: React.PropsWithChildren<ProjectProps>) => {
  return (
    <div className={style.project}>
      <h3>
        <div className={style.icon}>{icon}</div>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {title}
          <span className="dot">.</span>
        </a>{" "}
        <span className={style.tags}>{tags.join(" ⋅ ")}</span>
      </h3>
      <div className={style.text}>{children}</div>
    </div>
  );
};
export default Project;
