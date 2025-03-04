import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { INotebook } from "../interfaces";

interface IProps {
  handleCheckNotebook: (value: number) => void;
  notebookId: number;
  notebooksForSelect: INotebook[];
}

function NoteNotebookSelect(props: IProps) {
  const { handleCheckNotebook, notebookId, notebooksForSelect } = props;

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="note-notebook-select-label">Блокнот</InputLabel>
        <Select
          labelId="note-notebook-select-label"
          value={notebookId}
          onChange={(e) => handleCheckNotebook(Number(e.target.value))}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400, // Максимальная высота выпадающего меню
                overflowY: "auto", // Прокрутка
              },
            },
          }}
        >
          {notebooksForSelect.length > 0 ? (
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
    </>
  );
}

export default NoteNotebookSelect;
