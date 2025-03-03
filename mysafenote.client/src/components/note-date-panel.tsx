import React from "react";
import { Button } from "react-bootstrap";
import moment from "moment-timezone";

interface IProps {
  lastChangeDate: string;
  createDate: string;
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
            {moment.utc(lastChangeDate).tz(timeZone).format("DD.MM.YYYY HH:mm")}
          </label>
        </div>
        <div className="notebook-createDate__div">
          <label className="notebook-date-text__label">Создано: </label>
          <label>
            {moment.utc(createDate).tz(timeZone).format("DD.MM.YYYY HH:mm")}
          </label>
        </div>
      </div>
      )}
    </>
  );
}

export default NoteDatePanel;
