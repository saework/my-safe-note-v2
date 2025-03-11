// export interface INoteRow {
//   id: number;
//   title: string;
//   notebookName: string;
//   notebookId: number;
//   createDate: string;
//   lastChangeDate: string;
//   noteShortText: string;
//   noteHashPassword: string;
// }

export interface INoteRow {
  id: number;
  title: string;
  notebookName: string;
  notebookId?: number | null;
  createDate: Date; // Изменено на Date
  lastChangeDate: Date; // Изменено на Date
  noteShortText: string;
  noteHashPassword?: string; // Добавлено ?
}


export interface INoteRows {
  noteRows: INoteRow[];
}
export interface IRootReducer {
  currentUser: string;
  userId: number;
  needLoadData: boolean;
  currentNoteId: number;
  currentNotebookId: number | null;
  currentNotebookName: string;
  noteBody: string;
  // jwtToken: {};
  jwtToken: string;
  noteRows: INoteRow[];
  notebooks: INotebook[];
}
export interface IRouter {
  location: any;
  action: string;
}
export interface IStore {
  router: IRouter;
  rootReducer: IRootReducer;
}
export interface ILoginData {
  currentUser: string;
  userId: number;
  jwtToken: string;
}
export interface INotebookDto {
    id: number;
    name: string;
    userId: number;
  }
// export type TActionPayload = number | INoteRow |INoteRow[] | INoteRows | ILoginData | boolean | INotebookDto| string;

export interface IAction {
  type: string;
  // payload: TActionPayload;
  payload: any;
}
export interface ItmzObj {
  timeZoneValue: string;
  timeZoneText: string;
}
export interface ISendData {
  rootReducer: IRootReducer
  currentUser: string;
  // jwtToken: {};
  jwtToken: string;
}
export interface INotebook {
  id: number;
  name: string;
}
// export interface INoteDto {
//   noteId?: string;
//   title: string;
//   createDate: string;
//   lastChangeDate: string;
//   notebookId: string;
//   noteBody: string;
//   notePasswordHash?: string;
//   userId: string;
// }

export interface INoteDto {
  noteId: number;
  title: string;
  createDate: Date; // Изменено на Date
  lastChangeDate: Date; // Изменено на Date
  notebookId?: number | null;
  noteBody: string;
  notePasswordHash?: string; // Добавлено ?
  userId: number;
}

// export interface IResponseNoteDto {
//   title: string;
//   createDate: string;
//   lastChangeDate: string;
//   notebookId: string;
//   noteBody: string;
//   notePasswordHash?: string;
// }

// export interface IResponseNoteDto {
//   title: string;
//   createDate: string;
//   lastChangeDate: string;
//   notebookId: string;
//   notebookName: string;
//   noteBody: string;
//   notePasswordHash?: string;
// }

export interface IResponseNoteDto {
  title: string; 
  createDate: Date; 
  lastChangeDate: Date; 
  notebookId?: number | null; 
  notebookName?: string; 
  noteBody?: string;
  notePasswordHash?: string;
}