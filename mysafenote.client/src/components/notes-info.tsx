import * as _ from 'lodash';
//import _chunk from 'lodash/chunk';

import React, { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
//import { connect } from 'react-redux';
//import { Row, Col, Table, Button } from 'react-bootstrap';
//import { Row, Col, Table} from 'react-bootstrap';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
//import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
//import moment from 'moment';
import moment from 'moment-timezone';
//import { delNoteRow, checkIdNoteRow, resetStore } from '../actions/actions';
import { getRowById } from '../functions';
import { INoteRow, IStore } from '../interfaces';
import TableSearch from './table-search';
import DeleteModal from './delete-modal';

import CreateNotebookModal from './createNotebook-modal';
import EditNotebookModal from './editNotebook-modal';
import NotesImport from './notes-import';

//import { history } from '../store/store';
//import * as config from '../configs/config';
import config from '../configs/config';
import { deleteNoteFromServer, loadNoteBodyFromServer, saveNoteToServer } from "../api/note-api";
//import { loadNotesDataFromServer, loadNotebooksDataFromServer, exportNotesFromServer, importNotesToServer } from '../api/main-api';
import { exportNotesFromServer, importNotesToServer } from '../api/main-api';
//import { saveNotebookToServer } from "../api/notebook-api";

import { StateContext } from "../state/notes-context";
import { ACTIONS, DispatchContext } from "../state/notes-context";
//import '../style.scss';

interface IProps {
  //noteRows: INoteRow[];
  delNoteRow: (NoteRowId: number) => void;
  checkIdNoteRow: (NoteRowId: number) => void;
  //setBdPeriodVal: (bdPeriodVal: string) => void;
  setButtonAddName: (buttonAddName: string) => void;
  setStartDate: (startDate: Date) => void;
  settitleVal: (titleVal: string) => void;
  setnoteShortTextVal: (noteShortTextVal: string) => void;
  setLastChangeDateVal: (lastChangeDateVal: string) => void;
  titleRef: any;
  //handlerSaveToServer: any;
  resetStore: () => void;
  setFormVisible: (formVisible: boolean) => void;
  handlerLoadFromServer: () => void;
  //userId: number
}

function NotesInfo(props : IProps) {

  const {handlerLoadFromServer} = props;
  
  const dispatch = useContext(DispatchContext);
  const notesState = useContext(StateContext);
  const navigate = useNavigate();
  
  //const currentUser = notesState.currentUser;
  //const jwtToken = notesState.jwtToken;
  const noteRows = notesState.noteRows;
  const notebooks = notesState.notebooks;
  const userId = notesState.userId;
  console.log("NotesInfo");
  //console.log(userId);
  console.log(notesState);
  
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  //const timeZone = "Europe/Moscow";
  //console.log(timeZone);
  //!!!

  const pageSize = config.PAGINATION_ROW_COUNT;
  const allnoteFilterName = config.ALLNOTES_FILTER_NAME;
  const withoutnotebookFilterName = config.WITHOUTNOTEBOOK_FILTER_NAME;

  const [needSave, setNeedSave] = useState<boolean>(false);
  const [datanoteRows, setDatanoteRows] = useState<INoteRow[]>(noteRows);
  const [filteredData, setFilteredData] = useState<INoteRow[]>(noteRows);
  const [displayData, setDisplayData] = useState<INoteRow[]>(noteRows);
  // const [sort, setSort] = useState<any>('asc');
  const [sort, setSort] = useState<any>('desc');
  const [search, setSearch] = useState<any>('');
  const [sortRowNum, setSortRowNum] = useState<string>('\u2193');
  const [sortRowName, setSortRowName] = useState<string>('');
  const [sortRowComm, setSortRowComm] = useState<any>('');
  const [sortRowDate, setSortRowDate] = useState<any>('');
  const [sortRowLastChangeDate, setSortRowLastChangeDate] = useState<any>('');
  const [sortRowPeriod, setSortRowPeriod] = useState<any>('');
  //const [pageCount, setPageCount] = useState(Math.ceil(noteRows.length / pageSize));
  const [pageCount, setPageCount] = useState(Math.ceil((noteRows || []).length / pageSize));
  const [currentPage, setCurrentPage] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [notebookModalShow, setNotebookModalShow] = useState(false);
  const [notebookEditModalShow, setNotebookEditModalShow] = useState(false);
  
  const [delRowId, setDelRowId] = useState(0);

  const [selectedRowId, setSelectedRowId] = useState(0);
  //const [selectedNotebookId, setSelectedNotebookId] = useState(0);
  const [currentNotebookId, setCurrentNotebookId] = useState(0);
  const [currentNotebookName, setCurrentNotebookName] = useState(allnoteFilterName);

  const [sortField, setSortField] = useState("lastChangeDate");
  //const [sortType, setSortType] = useState("desc");
  const [menuVisible, setMenuVisible] = useState(false);
  const [importNotesModalShow, setImportNotesModalShow] = useState(false);
  


  const getFinalFilteredData = () => {
    let filteredNotes = datanoteRows;
      if (filteredNotes)
      {

      // Фильтрация по currentNotebookName
      if (currentNotebookName === allnoteFilterName) {
        // Без дополнительной фильтрации
      } else if (currentNotebookName === withoutnotebookFilterName) {
        // Выводим заметки, у которых поле notebookId = 0 или null
        filteredNotes = filteredNotes.filter(note => note.notebookId === 0 || note.notebookId === null);
      } else if (currentNotebookName) {
        // Выводим заметки только те, у которых notebookId = выбранному значению
        filteredNotes = filteredNotes.filter(note => note.notebookId === currentNotebookId);
      }

    // Поиск
    if (search) {
      filteredNotes = filteredNotes.filter((item) => {
        const titleMatch = item.title && item.title.toLowerCase().includes(search.toLowerCase());
        //const shortTextMatch = item.noteShortText && item.noteShortText.toLowerCase().includes(search.toLowerCase());
        const lastChangeDateMatch = item.lastChangeDate && item.lastChangeDate.toLowerCase().includes(search.toLowerCase());
        const createDateMatch = item.createDate && item.createDate.toLowerCase().includes(search.toLowerCase());
        //return titleMatch || shortTextMatch || createDateMatch;
        return titleMatch || lastChangeDateMatch || createDateMatch;
      });
    }
  }

    // Сортировка
    //filteredNotes = _.orderBy(filteredNotes, 'title', sort); // Замените 'title' на нужное поле для сортировки
    filteredNotes = _.orderBy(filteredNotes, sortField, sort);

    return filteredNotes;
  };

  useEffect(() => {
    setDatanoteRows(noteRows);
  }, [noteRows]);


  const getPageCount = () => {
    // return Math.ceil(filteredData.length / pageSize);
    return Math.ceil((filteredData || []).length / pageSize);
  };

  //   useEffect(() => {
  //   console.log("navigate")
  //   console.log(userId)
  //   if (userId === 0 || !userId)
  //     navigate('/login');
  // }, [userId]);
  
  useEffect(() => {
    const finalFilteredData = getFinalFilteredData();
    setFilteredData(finalFilteredData);
    setCurrentPage(0); // Сброс текущей страницы при изменении фильтров
  }, [search, currentNotebookName, datanoteRows, sort]);
  
  useEffect(() => {
    setPageCount(getPageCount());
    setDisplayData(getDisplayData(currentPage, filteredData));
  }, [filteredData, currentPage]);

  const getDisplayData = (currPage: number, data: INoteRow[]) => {
    if (data && data.length > 0) {
      return _.chunk(data, pageSize)[currPage] || [];
    }
    return [];
  };

  const handleSortClick = (sortField) => {
    const sortType = sort === 'asc' ? 'desc' : 'asc';
    //const sortTypeVal = sort === 'asc' ? 'desc' : 'asc';

    setSortField(sortField);
    //setSortType(sortTypeVal);

  // Обновляем данные сразу после изменения сортировки
  const finalFilteredData = getFinalFilteredData();
  setFilteredData(finalFilteredData);
  setCurrentPage(0); // Сброс текущей страницы при изменении сортировки

  setSort(sortType); 

    if (sortField === 'title') {
      if (sortType === 'asc') {
        setSortRowName('\u2193');
        //setSortRowComm('');
        setSortRowLastChangeDate('');
        setSortRowDate('');
        //setSortRowPeriod('');
        setSortRowNum('');
      } else {
        setSortRowName('\u2191');
        //setSortRowComm('');
        setSortRowLastChangeDate('');
        setSortRowDate('');
        //setSortRowPeriod('');
        setSortRowNum('');
      }
    } 
    if (sortField === 'lastChangeDate') {
      if (sortType === 'asc') {
        setSortRowName('');
        //setSortRowComm('\u2193');
        setSortRowLastChangeDate('\u2193');
        setSortRowDate('');
        //setSortRowPeriod('');
        setSortRowNum('');
      } else {
        setSortRowName('');
        //setSortRowComm('\u2191');
        setSortRowLastChangeDate('\u2193');
        setSortRowDate('');
        //setSortRowPeriod('');
        setSortRowNum('');
      }
    }
    if (sortField === 'createDate') {
      if (sortType === 'asc') {
        setSortRowName('');
        //setSortRowComm('');
        setSortRowLastChangeDate('');
        setSortRowDate('\u2193');
        //setSortRowPeriod('');
        setSortRowNum('');
      } else {
        setSortRowName('');
        //setSortRowComm('');
        setSortRowLastChangeDate('');
        setSortRowDate('\u2191');
        //setSortRowPeriod('');
        setSortRowNum('');
      }
    }
    if (sortField === 'id') {
      if (sortType === 'asc') {
        setSortRowName('');
        //setSortRowComm('');
        setSortRowLastChangeDate('');
        setSortRowDate('');
        //setSortRowPeriod('');
        setSortRowNum('\u2193');
      } else {
        setSortRowName('');
        //setSortRowComm('');
        setSortRowLastChangeDate('');
        setSortRowDate('');
        //setSortRowPeriod('');
        setSortRowNum('\u2191');
      }
    }
  };

  const pageChangeHandler = ({ selected }: any) => {
    setCurrentPage(selected);
    setDisplayData(getDisplayData(selected, filteredData));
  };

  const searchHandler = (searchText : string) => {
    setSearch(searchText);
    setCurrentPage(0);
  };

  const handleExitButtonClick = () => {
    localStorage.removeItem('loginData');
    //dispatch({ type: "NEED_LOAD_DATA", payload: true });
    dispatch?.({ type: ACTIONS.RESET_STORE, payload: 0});
    navigate('/login');
  };

  const handleDelButtonClick = (NoteRowId : number) => {
    setDelRowId(NoteRowId);
    //console.log(NoteRowId);
    setModalShow(true);
  };
  //const handleDeleteRow = () => {
    const handleDeleteRow = async function (){
    if (delRowId !== 0) {
      console.log("handleDeleteRow start");
      var delResult = await deleteNoteFromServer(delRowId);
      console.log(delResult);
      //handlerLoadFromServer();
      dispatch?.({ type: ACTIONS.NEED_LOAD_DATA, payload: true });
      setModalShow(false);
      console.log("handleDeleteRow end");
      navigate('/main');
    }
  };

  const handleAddNotebookButtonClick = async function (){
    setNotebookModalShow(true);
  }

  //const handleEditButtonClick = (NoteRowId : number) => {
    const handleEditButtonClick = async function (currentNoteId) {
      //const userId = notesState.userId;
    //const currentNoteId = notesState.currentNoteId;
    dispatch?.({ type: ACTIONS.CHECK_ID_ROW, payload: currentNoteId });
    //let noteBodyFromServer = await loadNoteBodyFromServer(userId, currentNoteId);
    const url = '/note';
    navigate(url);
  };

  const handleEditNotebookButtonClick = () => {
    setNotebookEditModalShow(true);
  }

  //const handleCheckNotebook = (notebookId, notebookName) => {
  const handleCheckNotebook = (notebookIdChecked: number, notebookName: string) => {

      console.log("handleCheckNotebook");
      console.log(notebookIdChecked);
      //console.log(notebooks);
      
    setCurrentNotebookId(notebookIdChecked);
    setCurrentNotebookName(notebookName);
    dispatch?.({ type: ACTIONS.CHECK_NOTEBOOK_ID, payload: notebookIdChecked });
    dispatch?.({ type: ACTIONS.CHECK_NOTEBOOK_NAME, payload: notebookName });
  }

  const handleAddButtonClick = (e) => {
    //e.preventDefault();
    dispatch?.({ type: ACTIONS.CHECK_ID_ROW, payload: 0 });
    const url = '/note';
    navigate(url);
  }

  // const handleMenuButtonClick = (e) => {
  //   //e.preventDefault();
  //   dispatch({ type: ACTIONS.CHECK_ID_ROW, payload: 0 });
  //   const url = '/note';
  //   navigate(url);
  // } 

  const handleMenuButtonClick = () => {
    console.log("Меню кнопка нажата");
    console.log(menuVisible);
    setMenuVisible(!menuVisible); // Переключаем видимость выпадающего списка
  };

  const handleFirstOptionClick = () => {
    console.log("Первая кнопка нажата");
    setMenuVisible(false); // Закрываем меню после нажатия
  };

  const handleSecondOptionClick = () => {
    console.log("Вторая кнопка нажата");
    setMenuVisible(false); 
  };

  const handlerExportNotesFromServer = async function (){
    console.log("handlerExportNotesFromServer");
    //console.log(data);
    await exportNotesFromServer(userId);
  }

  // const handlerImportNotesToServer = async function (){
  //   console.log("handlerImportNotesToServer");
  
  //   if (!file) {
  //     alert('Пожалуйста, выберите zip-файл для загрузки.');
  //     return;
  //   }
  //   //await importNotesToServer(userId, file);
  //   var result = await importNotesToServer(userId, file);
  //   //console.log(result);
  //   if (result === true)
  //   {
  //     handlerLoadFromServer();
  //   }
  // }
  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0]);
  // };

  const handlerImportNotes = function () {
    setImportNotesModalShow(true)
  }

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
          userId = {userId}
          notebookModalShow={notebookModalShow}
          handleNotebookCloseModal={() => setNotebookModalShow(false)}
          // handleCheckNotebook={() => handleCheckNotebook}
          handleCheckNotebook={handleCheckNotebook}
          
       />
      <EditNotebookModal
          userId = {userId}
          currentNotebookId = {currentNotebookId}
          currentNotebookName = {currentNotebookName}
          notebookEditModalShow={notebookEditModalShow}
          handleNotebookEditCloseModal={() => setNotebookEditModalShow(false)}
       />

        <div className="main-info__capt-container">
        <div 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        <Button
              id="buttonMenu"
              type="button"
              //variant="success"
              variant="info"
              onClick={handleMenuButtonClick}
              className="menu__button"
            >
              Меню
            </Button>
            </div>

            {/* <div className = "menu-container">
              <div className="sub-menu__button">
            {menuVisible && ( <Button onClick={handleFirstOptionClick} type="button" variant="danger" className="sub-menu__button1">Первая кнопка</Button>
            )}
            </div>
             </div> */}
          <div className = "menu-container"
                  onMouseEnter={handleMouseEnter} 
                  onMouseLeave={handleMouseLeave}
          >
            {menuVisible && (
             <div className="main-menu-dropdown">
               {/* <Button onClick={handleFirstOptionClick} type="button" className="main-menu-dropdown__button" variant="danger">Первая кнопка</Button> */}
              
              <Button onClick={handlerExportNotesFromServer} id="buttonExportNotes" type="button" variant="info" size="lg" className="main-menu-export__button">
                Сохранить заметки
              </Button>
              <Button onClick={handlerImportNotes} id="buttonImportNotes" type="button" variant="info" size="lg" className="main-menu-import__button">
                Загрузить заметки
              </Button>

              {/* <div>
              <input type="file" accept=".zip" onChange={handleFileChange} />
                <button onClick={handlerImportNotesToServer}>Загрузить заметки</button>
              </div> */}



        {/* <Alert className="message__alert_center" variant="light" id="mainLabel">
          {handlerLoading()}
        </Alert> */}

              {/* <Button onClick={handleSecondOptionClick} type="button" className="main-menu-dropdown__button" variant="light">Вторая кнопка</Button> */}
             </div> 
          )}
         </div>
         <NotesImport
            userId = {userId}
            handlerLoadFromServer = {handlerLoadFromServer}
            importNotesModalShow={importNotesModalShow}
            handleImportNotesCloseModal={() => setImportNotesModalShow(false)}
            // handlerImportNotesToServer={handlerImportNotesToServer}
         />


          <div className="main-info__page-capt">Мои заметки</div>
          <div>
            <Button
              id="buttonExit"
              type="button"
              variant="danger"
              // block
              onClick={handleExitButtonClick}
              className="exit__button"
            >
              Выйти
            </Button>
          </div>
          {/* <div className = "menu-container"> */}
          {/* {menuVisible && (
             <div className="dropdown-menu">
               <Button onClick={handleFirstOptionClick} type="button" variant="danger" className="exit__button">Первая кнопка</Button>
              <Button onClick={handleSecondOptionClick} type="button" variant="light">Вторая кнопка</Button>
             </div> 
          )} */}
            {/* </div> */}
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
                <Button onClick={handleAddNotebookButtonClick} id="buttonAdd" type="button" variant="success" size="sm" className="notebook__button-add">
                  Добавить блокнот
                </Button>

                {/* <div>{currentNotebookId}</div> */}
                <div className="notebook-table-container"> {/* Оберните таблицу в новый div */}
                <Table responsive="sm">
                  <thead>
                    <tr>
                      <th className="main-info-notebook__th">
                        {/* Блокноты */}
                      </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr onClick={() => {handleCheckNotebook(0, allnoteFilterName)}}
                        // <tr onClick={() => {setCurrentNotebookId(0)
                        //     setCurrentNotebookName(allnoteFilterName)}}
                            className={ currentNotebookName === allnoteFilterName ? "main-info__tr-selected" : "main-info__tr" }
                        >
                          <td>{allnoteFilterName}</td>
                        </tr>
                        <tr onClick={() => {handleCheckNotebook(0, withoutnotebookFilterName)}}
                        // <tr  onClick={() => {setCurrentNotebookId(0)
                        //     setCurrentNotebookName(withoutnotebookFilterName)}}
                            className={ currentNotebookName === withoutnotebookFilterName ? "main-info__tr-selected" : "main-info__tr" }
                        >
                          <td>{withoutnotebookFilterName}</td>
                        </tr>
                    {/* {notebooks.length > 0 && ( */}
                    { (notebooks && notebooks.length > 0) && (
                      <>
                        {notebooks.map((notebook, index) => (
                          <tr key={notebook.id}
                          onDoubleClick={() => handleEditNotebookButtonClick()} 
                          // onClick={() => {setCurrentNotebookId(notebook.id)
                          //   setCurrentNotebookName(notebook.name)
                          onClick={() => handleCheckNotebook(notebook.id, notebook.name)
                          } // Устанавливаем выделенную строку

                          className={ currentNotebookId === notebook.id ? "main-info__tr-selected" : "main-info__tr" }
                          >
                          <td className="main-info-notebook__td">
                            {notebook.name}
                          </td>
                          <td className="main-info-notebook__td-edit">
                            <div>
                              <button id="editNotebook-button" type="button" className="manual__button" onClick={() => handleEditNotebookButtonClick()} onKeyDown={() => handleEditNotebookButtonClick()}>
                                <img className="main-info__edit" src="images/edit.svg" alt="edit" />
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
            <Button onClick={handleAddButtonClick} id="buttonAdd" type="button" variant="success" size="lg" className="main-form__button-add">
              Добавить заметку
            </Button>
        <Table responsive="sm">
          <thead>
            <tr>
              <th className="main-info__th-num" onClick={() => handleSortClick('id')}>
                №
                {' '}
                {sortRowNum}
              </th>
              <th className="main-info__th-name" onClick={() => handleSortClick('title')}>
                Название
                {' '}
                {sortRowName}
              </th>
              {/* <th className="main-info__th-text" onClick={() => handleSortClick('noteShortText')}>
                Подробности
                {' '}
                {sortRowComm}
              </th> */}
              <th className="main-info__th-date" onClick={() => handleSortClick('lastChangeDate')}>
                Изменено
                {' '}
                {sortRowLastChangeDate}
              </th>
              <th className="main-info__th-date" onClick={() => handleSortClick('createDate')}>
                Создано
                {' '}
                {sortRowDate}
              </th>
              {/* <th className="main-info__th-period" onClick={() => handleSortClick('bdPeriod')}>
                Период
                {' '}
                {sortRowPeriod}
              </th> */}
              <th className="main-info__th-edit"> </th>
              <th className="main-info__th-edit"> </th>
            </tr>
          </thead>

          <tbody>
            {/* {noteRows.length > 0 && ( */}
            {noteRows && noteRows.length > 0 && (
              <>
                {displayData.map((NoteRow, index) => (
                  <tr 
                    key={NoteRow.id}
                    onDoubleClick={() => handleEditButtonClick(NoteRow.id)} 
                    onClick={() => setSelectedRowId(NoteRow.id)} // Устанавливаем выделенную строку
                    // style={{ backgroundColor: selectedRowId === NoteRow.id ? '#d3d3d3' : 'transparent' }}
                    className={ selectedRowId === NoteRow.id ? "main-info__tr-selected" : "main-info__tr" }
                  >
                    {sort !== 'asc' && sortRowNum !== '' ? <td>{noteRows.length - (index + currentPage * pageSize)}</td> : <td>{index + 1 + currentPage * pageSize}</td>}
                    <td>{NoteRow.title}</td>
                    {/* <td>{NoteRow.noteShortText}</td> */}
                    {/* <td>{moment(NoteRow.lastChangeDate).format('DD.MM.YYYY HH:mm')}</td> */}
                    <td>{moment.utc(NoteRow.lastChangeDate).tz(timeZone).format('DD.MM.YYYY HH:mm')}</td>
                    <td>{moment.utc(NoteRow.createDate).tz(timeZone).format('DD.MM.YYYY HH:mm')}</td>
                    {/* <td>{NoteRow.bdPeriod}</td> */}
                    <td className="main-info__td-edit">
                      <div>
                        <button id="edit-button" type="button" className="manual__button" onClick={() => handleEditButtonClick(NoteRow.id)} onKeyDown={() => handleEditButtonClick(NoteRow.id)}>
                          <img className="main-info__edit" src="images/edit.svg" alt="edit" />
                        </button>
                      </div>
                    </td>
                    <td className="main-info__td-edit">
                      <div>
                        <button id="del-button" type="button" className="manual__button" onClick={() => handleDelButtonClick(NoteRow.id)} onKeyDown={() => handleDelButtonClick(NoteRow.id)}>
                          <img className="main-info__edit" src="images/trash.svg" alt="del" />
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
        {/* {noteRows.length > pageSize && ( */}
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

