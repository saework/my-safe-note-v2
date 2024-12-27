//import _ from 'lodash';
import _find from 'lodash/find';
import React, { useContext } from 'react';
//import { store } from './store/store';
import { INoteRow } from './interfaces';
import { StateContext } from "./state/notes-context";
import CryptoJS from 'crypto-js';
//import { ACTIONS, DispatchContext } from "../state/notes-context";
//import { DispatchContext } from "./state/notes-context";

//const dispatch = useContext(DispatchContext);
//const notesState = useContext(StateContext);

export const getcurrentNoteId = (): number | undefined => {
  //const { currentNoteId } = store.getState().rootReducer;
  //dispatch({ type: ACTIONS.EXPORT_ADD_GROUP, payload: payload });
  const notesState = useContext(StateContext);
  const currentNoteId = notesState?.currentNoteId;
  return currentNoteId;
};
export const getRowById = (NoteRowId: number): INoteRow => {
  //const { noteRows } = store.getState().rootReducer;
  const notesState = useContext(StateContext);
  const noteRows = notesState?.noteRows;
  //const NoteRow = _.find(noteRows as INoteRow[], { id: NoteRowId }) as INoteRow;
  const NoteRow = _find(noteRows as INoteRow[], { id: NoteRowId }) as INoteRow;
  return NoteRow;
};
export const validateEmail = (email: string): boolean => {
  // eslint-disable-next-line no-useless-escape
  const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
};
export const getLoginData = (dataType: string): string | {} => {
  const loginDataJSON = localStorage.getItem('loginData') as string;
  console.log(loginDataJSON);
  const loginData = JSON.parse(loginDataJSON);
  let res;
   if (loginData) {
    if (dataType === 'currenUser') {
      res = loginData.currenUser;
    }
    if (dataType === 'jwtToken') {
      res = loginData.jwtToken;
    }
    if (dataType === 'jwtAuthHeader') {
      const { jwtToken } = loginData;
      if (jwtToken) {
        res = { Authorization: `bearer ${jwtToken}` };
      }
    }
  }
  return res;
};

// Функция для шифрования заметки
export const encryptNote = (note: string, password: string): string => {
  if (!note || !password) {
      throw new Error('Пожалуйста, введите заметку и пароль.');
  }
  return CryptoJS.AES.encrypt(note, password).toString();
};

// Функция для дешифрования заметки
export const decryptNote = (encryptedNote: string, password: string): string => {
  if (!encryptedNote || !password) {
      throw new Error('Пожалуйста, введите зашифрованную заметку и пароль.');
  }
  const bytes = CryptoJS.AES.decrypt(encryptedNote, password);
  const originalNote = bytes.toString(CryptoJS.enc.Utf8);
  if (!originalNote) {
      throw new Error('Неверный пароль или зашифрованная заметка.');
  }
  return originalNote;
};