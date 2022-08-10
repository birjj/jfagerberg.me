import React from "react";

import style from "./work-history.module.css";

type WorkHistoryProps = {
  date: React.ReactNode;
  title: React.ReactNode;
};
const WorkHistory = ({
  title,
  date,
  children,
}: React.PropsWithChildren<WorkHistoryProps>) => {
  return (
    <div className={style.wrapper}>
      <div className={`hide--small ${style.date}`}>{date}</div>
      <h3>
        {title}
        <span className="dot">.</span>
      </h3>
      {children}
    </div>
  );
};
export default WorkHistory;
