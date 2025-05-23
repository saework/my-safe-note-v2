import React from "react";
import moment from "moment-timezone";

interface IProps {
  lastChangeDate: Date | null;
  createDate: Date | null;
}

function NoteDatePanel(props: IProps) {
  const { lastChangeDate, createDate } = props;

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <>
    {lastChangeDate && createDate && (
      <div className="notebook-date-container">
        <div className="notebook-lastChangeDate__div">
          <label className="notebook-date-text__label">Изменено: </label>
          <label>
            {moment(lastChangeDate).format("DD.MM.YYYY HH:mm")}
          </label>
        </div>
        <div className="notebook-createDate__div">
          <label className="notebook-date-text__label">Создано: </label>
          <label>
            {moment(createDate).format("DD.MM.YYYY HH:mm")}
          </label>
        </div>
      </div>
      )}
    </>
  );
}

export default NoteDatePanel;
