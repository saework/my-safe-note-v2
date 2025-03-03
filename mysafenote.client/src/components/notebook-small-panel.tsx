import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface IProps {
  handleCheckNotebook: (id: number, name: string) => void;
  handleEditNotebookButtonClick: () => void;
  handleAddNotebookButtonClick: () => void;
  notebooksForSelect: any[];
  currentNotebookId: number;
  currentNotebookName: string;
  withoutnotebookFilterName: string;
  allnoteFilterName: string;
}

const NotebookSmallPanel = React.memo((props: IProps) => {
  // function NotebookSmallPanel(props: IProps) {
  const {
    handleCheckNotebook,
    handleEditNotebookButtonClick,
    handleAddNotebookButtonClick,
    notebooksForSelect,
    currentNotebookId,
    currentNotebookName,
    withoutnotebookFilterName,
    allnoteFilterName
  } = props;

  return (
    <>
      <div className="notebook-small-panel">
        <div className="notebook-small-panel__select">
          <FormControl fullWidth>
            <InputLabel id="notes-notebook-select-label">Блокнот</InputLabel>
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
              {notebooksForSelect.length && notebooksForSelect.length > 0 ? (
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
    </>
  );
});

export default NotebookSmallPanel;
