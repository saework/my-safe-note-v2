import React from 'react';
import { Table,  Button } from 'react-bootstrap';
//import { Button, Row, Col, Table } from "react-bootstrap";
import { INotebookData } from "../interfaces";

interface IProps {
    notebooks: INotebookData[];
    currentNotebookId: number;
    currentNotebookName: string;
    handleAddNotebookButtonClick: () => void;
    handleCheckNotebook: () => void;
    handleEditNotebookButtonClick: () => void;
    allnoteFilterName: string;
    withoutnotebookFilterName: string;
  }


//   notebooks={notebooks}
//   currentNotebookId={currentNotebookId}
//   handleAddNotebookButtonClick={handleAddNotebookButtonClick}
//   handleCheckNotebook={handleCheckNotebook}
//   allnoteFilterName={allnoteFilterName}
//   withoutnotebookFilterName={withoutnotebookFilterName}
//   handleEditNotebookButtonClick={handleEditNotebookButtonClick}

const NotebookList = React.memo((props: IProps) => {

    const { 
        notebooks,
        currentNotebookId,
        currentNotebookName,
        handleAddNotebookButtonClick,
        handleCheckNotebook,
        handleEditNotebookButtonClick,
        allnoteFilterName,
        withoutnotebookFilterName
     } = props;


  return (
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
  );
});

export default NotebookList;