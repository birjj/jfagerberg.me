import React from "react";
import Link from "../../common/link";

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
        <div className={`hide--small ${style.icon}`}>{icon}</div>
        <Link noIcon href={url}>
          {title}
          <span className="dot">.</span>
        </Link>{" "}
        <span className={style.tags}>{tags.join(" ⋅ ")}</span>
      </h3>
      <div className={style.text}>{children}</div>
    </div>
  );
};
export default Project;
