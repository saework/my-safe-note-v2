import React, { useReducer, createContext } from "react";
import { IAction, IRootReducer, INoteRow, ILoginData } from '../interfaces';

// export const ACTIONS = {
//   EXPORT_ADD_GROUP: "EXPORT_ADD_GROUP",
//   EXPORT_DEL_GROUP: "EXPORT_DEL_GROUP",
//   EXPORT_EDIT_GROUP: "EXPORT_EDIT_GROUP",
//   EXPORT_ADD_USER: "EXPORT_ADD_USER",
//   EXPORT_DEL_USER: "EXPORT_DEL_USER",
//   EXPORT_EDIT_USER: "EXPORT_EDIT_USER"
// };

//const initialExportState = {  
  

// export const initialState: IRootReducer = {
//   currentUser: '',
//   currentId: 0,
//   checkedId: 0,
//   jwtToken: '',
//   noteRows: [],
// };

export const initialState: IRootReducer = {
  currentUser: '',
  needLoadData: false,
  currentId: 0,
  //checkedId: 0,
  jwtToken: '',
  noteRows: [],
};

// export const initialState: IRootReducer = {
//   currentUser: '',
//   needLoadData: false,
//   currentId: 0,
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
    case 'DRAW_ROWS': {
      return { ...state, noteRows: payload };
    }
    // case 'CHECK_ID_ROW': {
    //   return { ...state, checkedId: payload };
    // }
    case 'ADD_BD_ROW': {
      return {
        ...state,
        currentId: state.currentId + 1,
        noteRows: [...state.noteRows, payload],
      };
    }
    case 'DEL_BD_ROW': {
      return {
        ...state,
        noteRows: [...state.noteRows.filter((item) => item.id !== payload)],
      };
    }
    case 'EDIT_BD_ROW': {
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
    case 'LOAD_BD': {
      //return payload;
      console.log("load_bd");
      console.log(payload);
      return { ...state, noteRows: payload };
      
    }
    case 'LOGIN_SAVE_STORE': {
      const loginData: ILoginData = payload as ILoginData;
      return { ...state, currentUser: loginData.currentUser, jwtToken: loginData.jwtToken };
    }
    case 'RESET_STORE': {
      return initialState;
    }
    //!!!
    case 'NEED_LOAD_DATA': {
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
