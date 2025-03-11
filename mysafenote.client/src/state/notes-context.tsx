import React, { useReducer, createContext, ReactNode } from "react";
import { IAction, IRootReducer, INoteRow, ILoginData, INotebook } from "../interfaces";
import config from "../configs/config";

const allnoteFilterName = config.ALLNOTES_FILTER_NAME;
const withoutnotebookFilterName = config.WITHOUTNOTEBOOK_FILTER_NAME;

export const ACTIONS = {
  DRAW_ROWS: "DRAW_ROWS",
  CHECK_ID_ROW: "CHECK_ID_ROW",
  CHECK_NOTEBOOK_ID: "CHECK_NOTEBOOK_ID",
  CHECK_NOTEBOOK_NAME: "CHECK_NOTEBOOK_NAME",
  ADD_BD_ROW: "ADD_BD_ROW",
  DEL_BD_ROW: "DEL_BD_ROW",
  EDIT_BD_ROW: "EDIT_BD_ROW",
  LOAD_BD: "LOAD_BD",
  LOGIN_SAVE_STORE: "LOGIN_SAVE_STORE",
  RESET_STORE: "RESET_STORE",
  NEED_LOAD_DATA: "NEED_LOAD_DATA",
  LOAD_NOTEBOOKS: "LOAD_NOTEBOOKS",
  ADD_NOTEBOOK: "ADD_NOTEBOOK",
};

export const initialState: IRootReducer = {
  currentUser: "",
  userId: 0,
  needLoadData: false,
  currentNoteId: 0,
  currentNotebookId: 0,
  currentNotebookName: allnoteFilterName,
  noteBody: "",
  jwtToken: "",
  noteRows: [],
  notebooks: [],
};

// const reducer = (state, action) => {
  const reducer = (state: IRootReducer, action: IAction): IRootReducer => {
  const { payload, type } = action;
  switch (type) {
    case ACTIONS.DRAW_ROWS: {
      return { ...state, noteRows: payload as INoteRow[] };
    }
    case ACTIONS.CHECK_ID_ROW: {
      return { ...state, currentNoteId: payload as number };
    }
    case ACTIONS.CHECK_NOTEBOOK_ID: {
      return { ...state, currentNotebookId: payload as number | null };
    }
    case ACTIONS.CHECK_NOTEBOOK_NAME: {
      return { ...state, currentNotebookName: payload as string };
    }
    case ACTIONS.ADD_BD_ROW: {
      return {
        ...state,
        currentNoteId: state.currentNoteId + 1,
        noteRows: [...state.noteRows, payload as INoteRow],
      };
    }
    case ACTIONS.DEL_BD_ROW: {
      return {
        ...state,
        noteRows: [...state.noteRows.filter((item) => item.id !== payload)],
      };
    }
    case ACTIONS.EDIT_BD_ROW: {
      // Редактирование записи
      const editNoteRow: INoteRow = payload as INoteRow;
      const { id, title, createDate, noteShortText, lastChangeDate } =
        editNoteRow;
      return {
        ...state, // Возвращаем новый state
        noteRows: state.noteRows.map((NoteRow) => {
          if (NoteRow.id === id) {
            return {
              ...NoteRow, // Возвращаем новый NoteRow с новыми полями после ,
              title,
              createDate,
              noteShortText,
              lastChangeDate,
            };
          }
          return NoteRow; // В map возвращаем новый собранный NoteRow
        }),
      };
    }
    case ACTIONS.LOAD_BD: {
      return { ...state, noteRows: payload as INoteRow[] };
    }
    case ACTIONS.LOAD_NOTEBOOKS: {
      return { ...state, notebooks: payload as INotebook[] };
    }
    case ACTIONS.ADD_NOTEBOOK: {
      return {
        ...state,
        notebooks: [...state.notebooks, payload as INotebook],
      };
    }
    case ACTIONS.LOGIN_SAVE_STORE: {
      const loginData: ILoginData = payload as ILoginData;
      return {
        ...state,
        currentUser: loginData.currentUser,
        userId: loginData.userId,
        jwtToken: loginData.jwtToken,
      };
    }
    case ACTIONS.RESET_STORE: {
      return initialState;
    }
    case ACTIONS.NEED_LOAD_DATA: {
      return { ...state, needLoadData: payload as boolean };
    }
    default:
      return state;
  }
};

export const DispatchContext = createContext<React.Dispatch<IAction> | undefined>(undefined);
export const StateContext = createContext<IRootReducer | undefined>(undefined);

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<IRootReducer, IAction>>(
    reducer,
    initialState
  );
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
