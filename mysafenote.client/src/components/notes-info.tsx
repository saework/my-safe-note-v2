import * as _ from "lodash";
import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import ReactPaginate from "react-paginate";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { INoteRow } from "../interfaces";
import TableSearch from "./table-search";
import DeleteModal from "./delete-modal";
import CreateNotebookModal from "./createNotebook-modal";
import EditNotebookModal from "./editNotebook-modal";
import NotesImport from "./notes-import";
import config from "../configs/config";
import { deleteNoteFromServer, loadNotesDocxFromServer } from "../api/note-api";
import { exportNotesFromServer } from "../api/main-api";
import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";

import NotesTable from "./notes-tabel";
import NotebookList from "./notebook-list";
import NotebookSmallPanel from "./notebook-small-panel";
import Header from "./header";
import Menu from "./menu";
import Loader from '../components/loader';
import { db } from "../db-utils/db-config"; //!!!


interface IProps {
  handlerLoadFromServer: () => void;
}

function NotesInfo(props: IProps) {
  const { handlerLoadFromServer } = props;

  const dispatch = useContext(DispatchContext);
  const notesState = useContext(StateContext);
  const navigate = useNavigate();

  if (!notesState) {
    return <Loader />;
  }

  const noteRows = notesState.noteRows;
  const notebooks = notesState.notebooks;
  const userId = notesState.userId;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const pageSize = config.PAGINATION_ROW_COUNT;
  const allnoteFilterName = config.ALLNOTES_FILTER_NAME;
  const withoutnotebookFilterName = config.WITHOUTNOTEBOOK_FILTER_NAME;
  const [datanoteRows, setDatanoteRows] = useState<INoteRow[]>(noteRows);
  const [filteredData, setFilteredData] = useState<INoteRow[]>([]);
  const [displayData, setDisplayData] = useState<INoteRow[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState<string>("");

  const [sortRowNum, setSortRowNum] = useState<string>("\u2193");
  const [sortRowName, setSortRowName] = useState<string>("");
  const [sortRowDate, setSortRowDate] = useState<string>("");
  const [sortRowLastChangeDate, setSortRowLastChangeDate] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [notebookModalShow, setNotebookModalShow] = useState(false);
  const [notebookEditModalShow, setNotebookEditModalShow] = useState(false);
  const [delRowId, setDelRowId] = useState(0);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [currentNotebookId, setCurrentNotebookId] = useState(-1);
  const [currentNotebookName, setCurrentNotebookName] = useState(allnoteFilterName);

  const [sortField, setSortField] = useState("lastChangeDate");
  const [menuVisible, setMenuVisible] = useState(false);
  const [importNotesModalShow, setImportNotesModalShow] = useState(false);
  const [notebooksForSelect, setNotebooksForSelect] = useState<{ id: number; name: string }[]>([]);

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
            item.lastChangeDate.toLocaleString().toLowerCase().includes(search.toLowerCase());
          const createDateMatch =
            item.createDate &&
            item.createDate.toLocaleString().toLowerCase().includes(search.toLowerCase());
            
          return titleMatch || lastChangeDateMatch || createDateMatch;
        });
      }
    }

    // Сортировка
    filteredNotes = _.orderBy(filteredNotes, sortField, sort);
    return filteredNotes;
  }, [datanoteRows, currentNotebookName, search, sort, currentNotebookId]);

  useEffect(() => {
    if (noteRows && Array.isArray(noteRows)) {
      setDatanoteRows(noteRows);
    } else {
      setDatanoteRows([]);
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

  useEffect(() => {
    setFilteredData(getFinalFilteredData);
    setCurrentPage(0); // Сброс текущей страницы при изменении фильтров
  }, [getFinalFilteredData]);

  const pageCount = useMemo(() => {
    return Math.ceil((filteredData || []).length / pageSize);
  }, [filteredData]);

  useEffect(() => {
    setDisplayData(getDisplayData(currentPage, filteredData));
  }, [filteredData, currentPage]);

  const getDisplayData = (currPage: number, data: INoteRow[]) => {
    if (data && Array.isArray(data) && data.length > 0) {
      return _.chunk(data, pageSize)[currPage] || [];
    }
    return []; // Возвращаем пустой массив, если данных нет
  };

  const handleSortClick = useCallback(
    (field: string) => {
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
    },
    [sort]
  );

  const pageChangeHandler = ({ selected }: any) => {
    setCurrentPage(selected);
  };

  const searchHandler = (searchText: string) => {
    setSearch(searchText);
    setCurrentPage(0);
  };

  const handleExitButtonClick = async () => {
  //const handleExitButtonClick = () => { //!!!comm
    //localStorage.removeItem("loginData"); //!!!comm
    await db.delete('auth', 'loginData'); //!!!
    //!!!!
    //localStorage.removeItem("notesData");
    //localStorage.removeItem("notebooksData");
    //!!!!
    dispatch?.({ type: ACTIONS.RESET_STORE, payload: 0 });
    navigate("/login");
  };

  const handleDelButtonClick = (noteRowId: number) => {
    setDelRowId(noteRowId);
    setModalShow(true);
  };

  const handleDeleteRow = async () => {
    if (delRowId !== 0) {
      try {
        await deleteNoteFromServer(delRowId);
        dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
        setModalShow(false);
        navigate("/main");
      } catch (error) {
        console.error("handleDeleteRow - Ошибка при удалении заметки:", error);
      }
    }
  };

  const handleAddNotebookButtonClick = async function () {
    setNotebookModalShow(true);
  };

  const handleEditButtonClick = async (currentNoteId: number) => {
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

  const handleAddButtonClick = () => {
    dispatch?.({ type: ACTIONS.CHECK_ID_ROW, payload: 0 });
    const url = "/note";
    navigate(url);
  };

  const handleMenuButtonClick = () => {
    setMenuVisible(!menuVisible); // Переключаем видимость выпадающего списка
  };

  const handlerExportNotesFromServer = async () => {
    try {
      await exportNotesFromServer(userId);
    } catch (error) {
      console.error(
        "handlerExportNotesFromServer - Ошибка при экспорте заметок:",
        error
      );
    }
  };

  const handlerImportAllNotesDocx = async () => {
    try {
      await loadNotesDocxFromServer(userId);
    } catch (error) {
      console.error(
        "handlerImportAllNotesDocx - Ошибка при выгрузке всех заметок в docx формате:",
        error
      );
    }
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
          <Menu
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleMenuButtonClick={handleMenuButtonClick}
            handlerExportNotesFromServer={handlerExportNotesFromServer}
            handlerImportNotes={handlerImportNotes}
            handlerImportAllNotesDocx={handlerImportAllNotesDocx}
            menuVisible={menuVisible}
          />
          <NotesImport
            userId={userId}
            handlerLoadFromServer={handlerLoadFromServer}
            importNotesModalShow={importNotesModalShow}
            handleImportNotesCloseModal={() => setImportNotesModalShow(false)}
          />
          <Header handleExitButtonClick={handleExitButtonClick} />
        </div>

        <DeleteModal
          modalShow={modalShow}
          handleCloseModal={() => setModalShow(false)}
          handleDeleteRow={handleDeleteRow}
          deleteObjectName={"заметку"}
        />

        <TableSearch onSearch={searchHandler} />

        <div className="main-form__container">
          <NotebookList
            notebooks={notebooks}
            currentNotebookId={currentNotebookId}
            currentNotebookName={currentNotebookName}
            handleAddNotebookButtonClick={handleAddNotebookButtonClick}
            handleCheckNotebook={handleCheckNotebook}
            allnoteFilterName={allnoteFilterName}
            withoutnotebookFilterName={withoutnotebookFilterName}
            handleEditNotebookButtonClick={handleEditNotebookButtonClick}
          />

          <div className="main-form__notesinfo-container">
            <NotebookSmallPanel
              handleCheckNotebook={handleCheckNotebook}
              handleEditNotebookButtonClick={handleEditNotebookButtonClick}
              handleAddNotebookButtonClick={handleAddNotebookButtonClick}
              notebooksForSelect={notebooksForSelect}
              currentNotebookId={currentNotebookId}
              currentNotebookName={currentNotebookName}
              withoutnotebookFilterName={withoutnotebookFilterName}
              allnoteFilterName={allnoteFilterName}
            />

            <NotesTable
              handleAddButtonClick={handleAddButtonClick}
              handleSortClick={handleSortClick}
              handleEditButtonClick={handleEditButtonClick}
              handleDelButtonClick={handleDelButtonClick}
              setSelectedRowId={setSelectedRowId}
              sortRowNum={sortRowNum}
              sortRowName={sortRowName}
              sortRowLastChangeDate={sortRowLastChangeDate}
              sortRowDate={sortRowDate}
              noteRows={noteRows}
              displayData={displayData}
              selectedRowId={selectedRowId}
              sort={sort}
              currentPage={currentPage}
              pageSize={pageSize}
            />

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
