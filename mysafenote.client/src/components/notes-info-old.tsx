import * as _ from "lodash";
//import {_} from "lodash";
import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import ReactPaginate from "react-paginate";
import { Button, Row, Col, Table } from "react-bootstrap";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { INoteRow, IRootReducer } from "../interfaces";
import TableSearch from "./table-search";
import DeleteModal from "./delete-modal";
import CreateNotebookModal from "./createNotebook-modal";
import EditNotebookModal from "./editNotebook-modal";
import NotesImport from "./notes-import";
import config from "../configs/config";
import { deleteNoteFromServer } from "../api/note-api";
import { exportNotesFromServer } from "../api/main-api";
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";

interface IProps {
  handlerLoadFromServer: () => void;
}

function NotesInfo(props: IProps) {
  const { handlerLoadFromServer } = props;

  const dispatch = useContext(DispatchContext);
  const notesState = useContext(StateContext);
  const navigate = useNavigate();

  if (!notesState) {
    return <div>Загрузка...</div>; 
  }

  const noteRows = notesState.noteRows;
  const notebooks = notesState.notebooks;
  const userId = notesState.userId;

  console.log("NotesInfo");
  console.log(notesState);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const pageSize = config.PAGINATION_ROW_COUNT;
  const allnoteFilterName = config.ALLNOTES_FILTER_NAME;
  const withoutnotebookFilterName = config.WITHOUTNOTEBOOK_FILTER_NAME;

  const [needSave, setNeedSave] = useState<boolean>(false);
  const [datanoteRows, setDatanoteRows] = useState<INoteRow[]>(noteRows);
  // const [filteredData, setFilteredData] = useState<INoteRow[]>(noteRows);
  // const [displayData, setDisplayData] = useState<INoteRow[]>(noteRows);
    const [filteredData, setFilteredData] = useState<INoteRow[]>([]);
  const [displayData, setDisplayData] = useState<INoteRow[]>([]);
  const [sort, setSort] = useState<any>("desc");
  const [search, setSearch] = useState<any>("");

  const [sortRowNum, setSortRowNum] = useState<string>("\u2193");
  const [sortRowName, setSortRowName] = useState<string>("");

  //const [sortRowComm, setSortRowComm] = useState<any>("");
  const [sortRowDate, setSortRowDate] = useState<any>("");
  const [sortRowLastChangeDate, setSortRowLastChangeDate] = useState<any>("");
  //const [sortRowPeriod, setSortRowPeriod] = useState<any>("");

//!!!comm
  // const [pageCount, setPageCount] = useState(
  //   Math.ceil((noteRows || []).length / pageSize)
  // );
  //!!!comm

  const [currentPage, setCurrentPage] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [notebookModalShow, setNotebookModalShow] = useState(false);
  const [notebookEditModalShow, setNotebookEditModalShow] = useState(false);
  const [delRowId, setDelRowId] = useState(0);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [currentNotebookId, setCurrentNotebookId] = useState(-1);
  const [currentNotebookName, setCurrentNotebookName] =
    useState(allnoteFilterName);

  const [sortField, setSortField] = useState("lastChangeDate");
  const [menuVisible, setMenuVisible] = useState(false);
  const [importNotesModalShow, setImportNotesModalShow] = useState(false);
  // const [notebooksForSelect, setNotebooksForSelect] = useState(notebooks);
  const [notebooksForSelect, setNotebooksForSelect] = useState<any[]>([]);

  //const getFinalFilteredData = () => {
    const getFinalFilteredData = useMemo(() => {
    let filteredNotes = datanoteRows || [];
    if (filteredNotes) {
      // Фильтрация по currentNotebookName
      if (currentNotebookName === allnoteFilterName) {
        // Без дополнительной фильтрации
      } else if (currentNotebookName === withoutnotebookFilterName) {
        // Выводим заметки, у которых поле notebookId = 0 или null
        filteredNotes = filteredNotes.filter(
          (note) => note.notebookId === 0 || note.notebookId === null
        );
      } else if (currentNotebookName) {
        // Выводим заметки только те, у которых notebookId = выбранному значению
        filteredNotes = filteredNotes.filter(
          (note) => note.notebookId === currentNotebookId
        );
      }

      // Поиск
      if (search) {
        filteredNotes = filteredNotes.filter((item) => {
          const titleMatch =
            item.title &&
            item.title.toLowerCase().includes(search.toLowerCase());
          const lastChangeDateMatch =
            item.lastChangeDate &&
            item.lastChangeDate.toLowerCase().includes(search.toLowerCase());
          const createDateMatch =
            item.createDate &&
            item.createDate.toLowerCase().includes(search.toLowerCase());
          return titleMatch || lastChangeDateMatch || createDateMatch;
        });
      }
    }

    // Сортировка
    filteredNotes = _.orderBy(filteredNotes, sortField, sort);
    return filteredNotes;
  }, [datanoteRows, currentNotebookName, search, sort, currentNotebookId]);
  // };

  // useEffect(() => {
  //   setDatanoteRows(noteRows);
  // }, [noteRows]);

  useEffect(() => {
    if (noteRows && Array.isArray(noteRows)) {
      setDatanoteRows(noteRows);
    } else {
      setDatanoteRows([]); // Установите пустой массив, если noteRows не является массивом
    }
  }, [noteRows]);

  useEffect(() => {
    if (notebooks) {
      let notebooksForSelectNewVal = [
        { id: -2, name: withoutnotebookFilterName },
        { id: -1, name: allnoteFilterName },
        ...notebooks,
      ];
      setNotebooksForSelect(notebooksForSelectNewVal);
    }
  }, [notebooks]);

  //!!!comm
  // const getPageCount = () => {
  //   return Math.ceil((filteredData || []).length / pageSize);
  // };
  //!!!comm

  // useEffect(() => {
  //   const finalFilteredData = getFinalFilteredData();
  //   setFilteredData(finalFilteredData);
  //   //setDisplayData(getDisplayData(currentPage, finalFilteredData)); // Обновляем отображаемые данные
  //   setCurrentPage(0); // Сброс текущей страницы при изменении фильтров
  // }, [search, currentNotebookName, datanoteRows, sort]);
  useEffect(() => {
    setFilteredData(getFinalFilteredData);
    setCurrentPage(0); // Сброс текущей страницы при изменении фильтров
  }, [getFinalFilteredData]);

  const pageCount = useMemo(() => {
    return Math.ceil((filteredData || []).length / pageSize);
  }, [filteredData]);

//!!!comm
  // useEffect(() => {
  //   setPageCount(getPageCount());
  //   setDisplayData(getDisplayData(currentPage, filteredData));
  // }, [filteredData, currentPage]);
//!!!comm

useEffect(() => {
  setDisplayData(getDisplayData(currentPage, filteredData));
}, [filteredData, currentPage]);

  // const getDisplayData = (currPage: number, data: INoteRow[]) => {
  //   if (data && data.length > 0) {
  //     return _.chunk(data, pageSize)[currPage] || [];
  //   }
  //   return [];
  // };

  const getDisplayData = (currPage: number, data: INoteRow[]) => {
    if (data && Array.isArray(data) && data.length > 0) {
      return _.chunk(data, pageSize)[currPage] || [];
    }
    return []; // Возвращаем пустой массив, если данных нет
  };

  //!!!comm
  // const handleSortClick = (field: string) => {
  //   const newSort = sort === "asc" ? "desc" : "asc"; // Переключаем направление сортировки
  //   setSortField(field);
  //   setSort(newSort);
  //   setCurrentPage(0); // Сброс текущей страницы при изменении сортировки
  
  //   // Обновляем состояние стрелок сортировки
  //   if (newSort === "asc") {
  //     setSortRowNum(field === "id" ? "\u2191" : "");
  //     setSortRowName(field === "title" ? "\u2191" : "");
  //     setSortRowLastChangeDate(field === "lastChangeDate" ? "\u2191" : "");
  //     setSortRowDate(field === "createDate" ? "\u2191" : "");
  //   } else {
  //     setSortRowNum(field === "id" ? "\u2193" : "");
  //     setSortRowName(field === "title" ? "\u2193" : "");
  //     setSortRowLastChangeDate(field === "lastChangeDate" ? "\u2193" : "");
  //     setSortRowDate(field === "createDate" ? "\u2193" : "");
  //   }
  // };

  // const pageChangeHandler = ({ selected }: any) => {
  //   setCurrentPage(selected);
  //   setDisplayData(getDisplayData(selected, filteredData));
  // };
  //!!!comm
  //!!!
  // const handleSortClick = (field: string) => {
    const handleSortClick = useCallback((field: string) => {
    const newSort = sort === "asc" ? "desc" : "asc"; // Переключаем направление сортировки
    setSortField(field);
    setSort(newSort);
    setCurrentPage(0); // Сброс текущей страницы при изменении сортировки
  
    // Обновляем состояние стрелок сортировки
    if (newSort === "asc") {
      setSortRowNum(field === "id" ? "\u2191" : "");
      setSortRowName(field === "title" ? "\u2191" : "");
      setSortRowLastChangeDate(field === "lastChangeDate" ? "\u2191" : "");
      setSortRowDate(field === "createDate" ? "\u2191" : "");
    } else {
      setSortRowNum(field === "id" ? "\u2193" : "");
      setSortRowName(field === "title" ? "\u2193" : "");
      setSortRowLastChangeDate(field === "lastChangeDate" ? "\u2193" : "");
      setSortRowDate(field === "createDate" ? "\u2193" : "");
    }
  }, [sort]);

  const pageChangeHandler = ({ selected }: any) => {
    setCurrentPage(selected);
    //setDisplayData(getDisplayData(selected, filteredData));
  };
  //!!!

  const searchHandler = (searchText: string) => {
    setSearch(searchText);
    setCurrentPage(0);
  };

  const handleExitButtonClick = () => {
    localStorage.removeItem("loginData");
    dispatch?.({ type: ACTIONS.RESET_STORE, payload: 0 });
    navigate("/login");
  };

  const handleDelButtonClick = (noteRowId: number) => {
    setDelRowId(noteRowId);
    setModalShow(true);
  };

  const handleDeleteRow = async () => {
    if (delRowId !== 0) {
      await deleteNoteFromServer(delRowId);
      dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
      setModalShow(false);
      navigate("/main");
    }
  };

  const handleAddNotebookButtonClick = async function () {
    setNotebookModalShow(true);
  };

  const handleEditButtonClick = async (currentNoteId) => {
    dispatch?.({ type: ACTIONS.CHECK_ID_ROW, payload: currentNoteId });
    const url = "/note";
    navigate(url);
  };

  const handleEditNotebookButtonClick = () => {
    setNotebookEditModalShow(true);
  };

  const handleCheckNotebook = (
    notebookIdCheckedVal: number,
    notebookName: string
  ) => {
    let notebookIdChecked = notebookIdCheckedVal;

    setCurrentNotebookId(notebookIdChecked);
    setCurrentNotebookName(notebookName);
    dispatch?.({ type: ACTIONS.CHECK_NOTEBOOK_ID, payload: notebookIdChecked });
    dispatch?.({ type: ACTIONS.CHECK_NOTEBOOK_NAME, payload: notebookName });
  };

  const handleAddButtonClick = (e) => {
    //e.preventDefault();
    dispatch?.({ type: ACTIONS.CHECK_ID_ROW, payload: 0 });
    const url = "/note";
    navigate(url);
  };

  const handleMenuButtonClick = () => {
    setMenuVisible(!menuVisible); // Переключаем видимость выпадающего списка
  };

  const handlerExportNotesFromServer = async () => {
    await exportNotesFromServer(userId);
  };

  const handlerImportNotes = function () {
    setImportNotesModalShow(true);
  };

  const handleMouseEnter = () => {
    setMenuVisible(true);
  };

  const handleMouseLeave = () => {
    setMenuVisible(false);
  };

  return (
    <Row md={1} className="main-page__bd-info">
      <Col>
        <CreateNotebookModal
          userId={userId}
          notebookModalShow={notebookModalShow}
          handleNotebookCloseModal={() => setNotebookModalShow(false)}
          handleCheckNotebook={handleCheckNotebook}
        />
        <EditNotebookModal
          userId={userId}
          currentNotebookId={currentNotebookId}
          currentNotebookName={currentNotebookName}
          notebookEditModalShow={notebookEditModalShow}
          handleNotebookEditCloseModal={() => setNotebookEditModalShow(false)}
        />

        <div className="main-info__capt-container">
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Button
              id="buttonMenu"
              type="button"
              variant="info"
              onClick={handleMenuButtonClick}
              className="menu__button"
            >
              Меню
            </Button>
          </div>
          <div
            className="menu-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {menuVisible && (
              <div className="main-menu-dropdown">
                <Button
                  onClick={handlerExportNotesFromServer}
                  id="buttonExportNotes"
                  type="button"
                  variant="info"
                  size="lg"
                  className="main-menu-export__button"
                >
                  Сохранить заметки
                </Button>
                <Button
                  onClick={handlerImportNotes}
                  id="buttonImportNotes"
                  type="button"
                  variant="info"
                  size="lg"
                  className="main-menu-import__button"
                >
                  Загрузить заметки
                </Button>
              </div>
            )}
          </div>
          <NotesImport
            userId={userId}
            handlerLoadFromServer={handlerLoadFromServer}
            importNotesModalShow={importNotesModalShow}
            handleImportNotesCloseModal={() => setImportNotesModalShow(false)}
          />
          <div className="main-info__page-capt">Мои заметки</div>
          <div>
            <Button
              id="buttonExit"
              type="button"
              variant="danger"
              onClick={handleExitButtonClick}
              className="exit__button"
            >
              Выйти
            </Button>
          </div>
        </div>

        <DeleteModal
          modalShow={modalShow}
          handleCloseModal={() => setModalShow(false)}
          handleDeleteRow={handleDeleteRow}
          deleteObjectName={"заметку"}
        />
        <TableSearch onSearch={searchHandler} />
        <div className="main-form__container">
          <div className="main-form__notebooks-container">
            <div className="notebook__add-container">
              <Button
                onClick={handleAddNotebookButtonClick}
                id="buttonAdd"
                type="button"
                variant="success"
                size="sm"
                className="notebook__button-add"
              >
                Добавить блокнот
              </Button>
            </div>
            <div className="notebook-table-container">
              {" "}
              <Table responsive="sm">
                <thead>
                  <tr>
                    <th className="main-info-notebook__th">{/* Блокноты */}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    onClick={() => {
                      handleCheckNotebook(-1, allnoteFilterName);
                    }}
                    className={
                      currentNotebookName === allnoteFilterName
                        ? "main-info__tr-selected"
                        : "main-info__tr"
                    }
                  >
                    <td>{allnoteFilterName}</td>
                  </tr>
                  <tr
                    onClick={() => {
                      handleCheckNotebook(-2, withoutnotebookFilterName);
                    }}
                    className={
                      currentNotebookName === withoutnotebookFilterName
                        ? "main-info__tr-selected"
                        : "main-info__tr"
                    }
                  >
                    <td>{withoutnotebookFilterName}</td>
                  </tr>
                  {notebooks && notebooks.length > 0 && (
                    <>
                      {notebooks.map((notebook, index) => (
                        <tr
                          key={notebook.id}
                          onDoubleClick={() => handleEditNotebookButtonClick()}
                          onClick={() =>
                            handleCheckNotebook(notebook.id, notebook.name)
                          } // Устанавливаем выделенную строку
                          className={
                            currentNotebookId === notebook.id
                              ? "main-info__tr-selected"
                              : "main-info__tr"
                          }
                        >
                          <td className="main-info-notebook__td">
                            {notebook.name}
                          </td>
                          <td className="main-info-notebook__td-edit">
                            <div>
                              <button
                                id="editNotebook-button"
                                type="button"
                                className="manual__button"
                                onClick={() => handleEditNotebookButtonClick()}
                                onKeyDown={() =>
                                  handleEditNotebookButtonClick()
                                }
                              >
                                <img
                                  className="main-info__edit"
                                  src="images/edit.svg"
                                  alt="edit"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
          <div className="main-form__notesinfo-container">
            <div className="notebook-small-panel">
              <div className="notebook-small-panel__select">
                <FormControl fullWidth>
                  <InputLabel id="notes-notebook-select-label">
                    Блокнот
                  </InputLabel>
                  <Select
                    labelId="notes-notebook-select-label"
                    value={currentNotebookId}
                    onChange={(e) =>
                      handleCheckNotebook(
                        Number(e.target.value),
                        notebooksForSelect.find(
                          (notebook) => notebook.id === Number(e.target.value)
                        )?.name || ""
                      )
                    }
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 400, // Максимальная высота выпадающего меню
                          overflowY: "auto", // Прокрутка
                        },
                      },
                    }}
                  >
                    {notebooksForSelect.length &&
                    notebooksForSelect.length > 0 ? (
                      notebooksForSelect.map((notebook) => (
                        <MenuItem key={notebook.id} value={notebook.id}>
                          {notebook.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Нет доступных блокнотов</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </div>
              <div
                className={
                  currentNotebookName != withoutnotebookFilterName &&
                  currentNotebookName != allnoteFilterName
                    ? "notebook-small-edit"
                    : "hide__div"
                }
              >
                <button
                  id="notebookEditButton"
                  type="button"
                  className="edit-notebook__button"
                  onClick={handleEditNotebookButtonClick}
                  onKeyDown={handleEditNotebookButtonClick}
                >
                  <img
                    className="notebook-small-edit__img"
                    src="images/edit.svg"
                    alt="edit"
                  />
                </button>
              </div>
              <div className="notebook-small-add">
                <button
                  id="notebookAddButton"
                  type="button"
                  className="edit-notebook__button"
                  onClick={handleAddNotebookButtonClick}
                  onKeyDown={handleAddNotebookButtonClick}
                >
                  <img
                    className="notebook-small-add__img"
                    src="images/add.svg"
                    alt="add"
                  />
                </button>
              </div>
            </div>

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
                    {displayData && displayData.length > 0 && displayData.map((NoteRow, index) => (
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
                          {moment
                            .utc(NoteRow.lastChangeDate)
                            .tz(timeZone)
                            .format("DD.MM.YYYY HH:mm")}
                        </td>
                        <td className="main-info-lastChangeDate__td">
                          {moment
                            .utc(NoteRow.createDate)
                            .tz(timeZone)
                            .format("DD.MM.YYYY HH:mm")}
                        </td>
                        <td className="main-info__td-edit">
                          <div>
                            <button
                              id="edit-button"
                              type="button"
                              className="manual__button"
                              onClick={() => handleEditButtonClick(NoteRow.id)}
                              onKeyDown={() =>
                                handleEditButtonClick(NoteRow.id)
                              }
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
                              onKeyDown={() => handleDelButtonClick(NoteRow.id)}
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
            {pageCount > 1 && ( // Условие для отображения пагинации
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={pageChangeHandler}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="<"
                containerClassName="pagination"
                activeClassName="active"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                nextClassName="page-item"
                previousLinkClassName="page-link"
                nextLinkClassName="page-link"
                forcePage={currentPage}
              />
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
}
export default NotesInfo;
