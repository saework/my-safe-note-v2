export interface INoteRow {
  id: number;
  title: string;
  notebookName: string;
  notebookId?: number | null;
  createDate: Date;
  lastChangeDate: Date;
  noteShortText: string;
  noteHashPassword?: string;
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

export interface IAction {
  type: string;
  payload: any;
}

export interface ItmzObj {
  timeZoneValue: string;
  timeZoneText: string;
}

export interface ISendData {
  rootReducer: IRootReducer
  currentUser: string;
  jwtToken: string;
}

export interface INotebook {
  id: number;
  name: string;
}

export interface INoteDto {
  noteId: number;
  title: string;
  createDate: Date; 
  lastChangeDate: Date;
  notebookId?: number | null;
  noteBody: string;
  notePasswordHash?: string;
  userId: number;
}

export interface IResponseNoteDto {
  title: string; 
  createDate: Date; 
  lastChangeDate: Date; 
  notebookId?: number | null; 
  notebookName?: string; 
  noteBody?: string;
  notePasswordHash?: string;
}