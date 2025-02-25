export interface INoteRow {
  id: number;
  title: string;
  notebookName: string;
  notebookId: number;
  createDate: string;
  lastChangeDate: string;
  noteShortText: string;
  noteHashPassword: string;
}
export interface INoteRows {
  noteRows: INoteRow[];
}
export interface IRootReducer {
  currentUser: string;
  userId: number;
  needLoadData: boolean;
  currentNoteId: number;
  currentNotebookId: number;
  currentNotebookName: string;
  noteBody: string;
  jwtToken: {};
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
export interface INotebookData {
  id: number;
  name: string;
  userId: number;
}
export type TActionPayload = number | INoteRow | INoteRows | ILoginData | boolean | INotebookData| string;
export interface IAction {
  type: string;
  payload: TActionPayload;
}
export interface ItmzObj {
  timeZoneValue: string;
  timeZoneText: string;
}
export interface ISendData {
  rootReducer: IRootReducer
  currentUser: string;
  jwtToken: {};
}
export interface INotebook {
  id: number;
  name: string;
}