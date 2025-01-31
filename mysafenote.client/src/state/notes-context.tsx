import React, { useReducer, createContext } from "react";
import { IAction, IRootReducer, INoteRow, ILoginData } from '../interfaces';
import config from '../configs/config';

  const allnoteFilterName = config.ALLNOTES_FILTER_NAME;
  const withoutnotebookFilterName = config.WITHOUTNOTEBOOK_FILTER_NAME;
// export const ACTIONS = {
//   EXPORT_ADD_GROUP: "EXPORT_ADD_GROUP",
//   EXPORT_DEL_GROUP: "EXPORT_DEL_GROUP",
//   EXPORT_EDIT_GROUP: "EXPORT_EDIT_GROUP",
//   EXPORT_ADD_USER: "EXPORT_ADD_USER",
//   EXPORT_DEL_USER: "EXPORT_DEL_USER",
//   EXPORT_EDIT_USER: "EXPORT_EDIT_USER"
// };

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
  ADD_NOTEBOOK: "ADD_NOTEBOOK"
};

//const initialExportState = {  
  

// export const initialState: IRootReducer = {
//   currentUser: '',
//   currentNoteId: 0,
//   checkedId: 0,
//   jwtToken: '',
//   noteRows: [],
// };

export const initialState: IRootReducer = {
  currentUser: '',
  userId: 0,
  needLoadData: false,
  currentNoteId: 0,
  currentNotebookId: 0,
  currentNotebookName: allnoteFilterName,
  noteBody: '',
  //checkedId: 0,
  jwtToken: '',
  noteRows: [],
  notebooks:[],
};

// export const initialState: IRootReducer = {
//   currentUser: '',
//   needLoadData: false,
//   currentNoteId: 0,
//   //checkedId: 0,
//   jwtToken: '',
//   noteRows: [
//     {
//       id: 1,
//       title: "title1",
//       createDate: "createDate1",
//       noteShortText: "noteShortText1",
//       lastChangeDate: "lastChangeDate",
//       // bdPeriod: "bdPeriod"
//     },
//     {
//       id: 2,
//       title: "title2",
//       createDate: "createDate2",
//       noteShortText: "noteShortText2",
//       lastChangeDate: "lastChangeDate2",
//       // bdPeriod: "bdPeriod2"
//     },
//     {
//       id: 3,
//       title: "title3",
//       createDate: "createDate3",
//       noteShortText: "noteShortText3",
//       lastChangeDate: "lastChangeDate3",
//       // bdPeriod: "bdPeriod3"
//     }
//   ],
// };


// const reducer = (state, action) => {
//   const { payload, type } = action;
//   switch (type) {
//     case ACTIONS.EXPORT_ADD_GROUP:
//       return {
//         ...state,
//         recipients: [...state.recipients, payload],
//       };

//export function rootReducer(state: IRootReducer = initialState, action: IAction) {
 const reducer = (state, action) => {
  //const reducer = (state: IRootReducer, action: IAction): IRootReducer => {
  //const reducer = (state: IRootReducer, action: IAction) => {
  const { payload, type } = action;
  switch (type) {
    case ACTIONS.DRAW_ROWS: {
      return { ...state, noteRows: payload };
    }
    // case ACTIONS.CHECK_ID_ROW: {
    //   return { ...state, checkedId: payload };
    // }
    case ACTIONS.CHECK_ID_ROW: {
      return { ...state, currentNoteId: payload };
    }
    case ACTIONS.CHECK_NOTEBOOK_ID: {
      return { ...state, currentNotebookId: payload };
    }
    case ACTIONS.CHECK_NOTEBOOK_NAME: {
      return { ...state, currentNotebookName: payload };
    }
    case ACTIONS.ADD_BD_ROW: {
      return {
        ...state,
        currentNoteId: state.currentNoteId + 1,
        noteRows: [...state.noteRows, payload],
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
      //const { id, title, createDate, noteShortText, lastChangeDate, bdPeriod } = editNoteRow;
      const { id, title, createDate, noteShortText, lastChangeDate } = editNoteRow;
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
              //bdPeriod,
            };
          }
          return NoteRow; // В map возвращаем новый собранный NoteRow
        }),
      };
    }
    case ACTIONS.LOAD_BD: {
      //return payload;
      console.log("load_bd");
      //console.log(payload);
      return { ...state, noteRows: payload };
    } 
    case ACTIONS.LOAD_NOTEBOOKS: {
      //return payload;
      //console.log("LOAD_NOTEBOOKS");
      //console.log(payload);
      return { ...state, notebooks: payload };
    }
    case ACTIONS.ADD_NOTEBOOK: {
      return {
        ...state,
        //currentNotebookId: state.currentNotebookId + 1,
        notebooks: [...state.notebooks, payload],
      };
    } 
    case ACTIONS.LOGIN_SAVE_STORE: {
      const loginData: ILoginData = payload as ILoginData;
      return { ...state, currentUser: loginData.currentUser, userId: loginData.userId, jwtToken: loginData.jwtToken };
    }
    case ACTIONS.RESET_STORE: {
      return initialState;
    }
    //!!!
    case ACTIONS.NEED_LOAD_DATA: {
      return { ...state, needLoadData: payload };
    }
    //!!!
    default:
      return state;
  }
};

export const DispatchContext = createContext<React.Dispatch<IAction> | undefined>(undefined);
export const StateContext = createContext<IRootReducer | undefined>(undefined);

export const NotesProvider = ({ children }) => {
  //const [state, dispatch] = useReducer(reducer, initialState);
  const [state, dispatch] = useReducer<React.Reducer<IRootReducer, IAction>>(reducer, initialState);
  return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
  );
};
