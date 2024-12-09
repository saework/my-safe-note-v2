export interface INoteRow {
  // id: number;
  // persName: string;
  // bdDate: string;
  // bdComm: string;
  // bdTmz: string;
  // bdPeriod: string;

  id: number;
  title: string;
  createDate: string;
  lastChangeDate: string;
  noteShortText: string;
  //bdPeriod: string; //убрать
}
export interface INoteRows {
  noteRows: INoteRow[];
}
export interface IRootReducer {
  // currentUser: string;
  // needLoadData: boolean; //!!!
  // currentId: number;
  // checkedId: number;
  // jwtToken: {};
  // noteRows: INoteRow[];

  currentUser: string;
  needLoadData: boolean; //!!!
  currentId: number;
  //checkedId: number;
  jwtToken: {};
  noteRows: INoteRow[];

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
  jwtToken: string;
}
export type TActionPayload = number | INoteRow | INoteRows | ILoginData;
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
