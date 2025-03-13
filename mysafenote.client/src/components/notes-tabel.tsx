import React from "react";
import { Table, Button } from "react-bootstrap";
import moment from "moment-timezone";
import { INoteRow } from "../interfaces";

interface IProps {
  handleAddButtonClick: () => void;
  handleSortClick: (field: string) => void;
  handleEditButtonClick: (currentNoteId: number) => void;
  handleDelButtonClick: (currentNoteId: number) => void;
  setSelectedRowId: (currentNoteId: number) => void;
  sortRowNum: string;
  sortRowName: string;
  sortRowLastChangeDate: string;
  sortRowDate: string;
  noteRows: INoteRow[];
  displayData: INoteRow[];
  selectedRowId: number;
  sort: string;
  currentPage: number;
  pageSize: number;
  timeZone: any;
}

const NotesTable = React.memo((props: IProps) => {
  const {
    handleAddButtonClick,
    handleSortClick,
    handleEditButtonClick,
    handleDelButtonClick,
    setSelectedRowId,
    sortRowNum,
    sortRowName,
    sortRowLastChangeDate,
    sortRowDate,
    noteRows,
    displayData,
    selectedRowId,
    sort,
    currentPage,
    pageSize,
    timeZone,
  } = props;

  //!!!убрать!!
  function isDate(obj: any): obj is Date {
    return obj instanceof Date;
}

  console.log("!!!");
  if (displayData)
  {
  console.log(displayData[0]?.lastChangeDate);
  console.log(isDate(displayData[0]?.lastChangeDate));
  console.log(isDate(displayData[0]?.lastChangeDate));
  console.log(moment
                        .utc(displayData[0]?.lastChangeDate)
                        .tz(timeZone)
                        .format("DD.MM.YYYY HH:mm"))
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // timeZoneName: 'short', // Для отображения часового пояса
    timeZone: 'UTC', // Указываем нужный часовой пояс
};

// Форматируем дату с учетом часового пояса
const formattedDate = displayData[0]?.lastChangeDate.toLocaleString('ru-RU', options);

console.log(formattedDate);
  //moment(NoteRow.lastChangeDate)
 //!!!убрать!!

  return (
    <>
      <div className="main-form__add-container">
        <Button
          onClick={handleAddButtonClick}
          id="buttonAdd"
          type="button"
          variant="success"
          size="lg"
          className="main-form__button-add"
        >
          Добавить заметку
        </Button>
      </div>
      <Table responsive="sm">
        <thead>
          <tr>
            <th
              className="main-info__th-num"
              onClick={() => handleSortClick("id")}
            >
              №{sortRowNum}
            </th>
            <th
              className="main-info__th-name"
              onClick={() => handleSortClick("title")}
            >
              Название {sortRowName}
            </th>
            <th
              className="main-info__th-date"
              onClick={() => handleSortClick("lastChangeDate")}
            >
              Изменено {sortRowLastChangeDate}
            </th>
            <th
              className="main-info__th-date"
              onClick={() => handleSortClick("createDate")}
            >
              Создано {sortRowDate}
            </th>
            <th className="main-info__th-edit"> </th>
            <th className="main-info__th-delete"> </th>
          </tr>
        </thead>

        <tbody>
          {noteRows && noteRows.length > 0 && (
            <>
              {displayData &&
                displayData.length > 0 &&
                displayData.map((NoteRow, index) => (
                  <tr
                    key={NoteRow.id}
                    onDoubleClick={() => handleEditButtonClick(NoteRow.id)}
                    onClick={() => setSelectedRowId(NoteRow.id)} // Устанавливаем выделенную строку
                    className={
                      selectedRowId === NoteRow.id
                        ? "main-info__tr-selected"
                        : "main-info__tr"
                    }
                  >
                    {sort !== "asc" && sortRowNum !== "" ? (
                      <td>
                        {noteRows.length - (index + currentPage * pageSize)}
                      </td>
                    ) : (
                      <td>{index + 1 + currentPage * pageSize}</td>
                    )}
                    <td>{NoteRow.title}</td>
                    <td className="main-info-createDate__td">
                      {//moment
                        // .utc(NoteRow.lastChangeDate)
                        moment(NoteRow.lastChangeDate)
                        //.tz(timeZone)
                        .format("DD.MM.YYYY HH:mm")}
                    </td>
                    <td className="main-info-lastChangeDate__td">
                      {//moment
                        // .utc(NoteRow.createDate)
                        moment(NoteRow.createDate)
                        //.tz(timeZone)
                        .format("DD.MM.YYYY HH:mm")}
                    </td>
                    <td className="main-info__td-edit">
                      <div>
                        <button
                          id="edit-button"
                          type="button"
                          className="manual__button"
                          onClick={() => handleEditButtonClick(NoteRow.id)}
                          // onKeyDown={() => handleEditButtonClick(NoteRow.id)}
                        >
                          <img
                            className="main-info__edit"
                            src="images/edit.svg"
                            alt="edit"
                          />
                        </button>
                      </div>
                    </td>
                    <td className="main-info__td-edit">
                      <div>
                        <button
                          id="del-button"
                          type="button"
                          className="manual__button"
                          onClick={() => handleDelButtonClick(NoteRow.id)}
                          // onKeyDown={() => handleDelButtonClick(NoteRow.id)}
                        >
                          <img
                            className="main-info__edit"
                            src="images/trash.svg"
                            alt="del"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </>
          )}
          {noteRows && noteRows.length === 0 && (
            <tr>
              <td colSpan={7}>
                <div className="main-page__bd-nodata">Список пуст</div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
});

export default NotesTable;
