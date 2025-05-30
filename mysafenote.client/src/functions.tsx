import _find from "lodash/find";
import React, { useContext } from "react";
import { INoteRow } from "./interfaces";
import { StateContext } from "./state/notes-context";
import CryptoJS from "crypto-js";

export const getcurrentNoteId = (): number | undefined => {
  const notesState = useContext(StateContext);
  const currentNoteId = notesState?.currentNoteId;
  return currentNoteId;
};

export const getRowById = (noteRowId: number): INoteRow | undefined => {
  const notesState = useContext(StateContext);
  const noteRows = notesState?.noteRows;
  const NoteRow = _find(noteRows as INoteRow[], { id: noteRowId }) as INoteRow | undefined;
  return NoteRow;
};

export const validateEmail = (email: string): boolean => {
  // eslint-disable-next-line no-useless-escape
    // Проверяем, что логин состоит минимум из 3 символов и содержит только буквы и цифры, тире и точка
    const res = /^[a-zA-Z0-9@-_.]{3,}$/;
    return res.test(String(email));
};

export const getLoginData = (dataType: string): string | { [key: string]: any } | undefined => {
  const loginDataJSON = localStorage.getItem("loginData") as string;
  if (!loginDataJSON) {
    return undefined;
  }
  const loginData = JSON.parse(loginDataJSON);
  let res;
  if (loginData) {
    if (dataType === "currenUser") {
      res = loginData.currenUser;
    }
    if (dataType === "userId") {
      res = loginData.userId;
    }
    if (dataType === "jwtToken") {
      res = loginData.jwtToken;
    }
    if (dataType === "jwtAuthHeader") {
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
    throw new Error("Пожалуйста, введите заметку и пароль.");
  }
  return CryptoJS.AES.encrypt(note, password).toString();
};

// Функция для дешифрования заметки
export const decryptNote = (
  encryptedNote: string,
  password: string
): string => {
  if (!encryptedNote || !password) {
    throw new Error("Пожалуйста, введите зашифрованную заметку и пароль.");
  }
  const bytes = CryptoJS.AES.decrypt(encryptedNote, password);
  const originalNote = bytes.toString(CryptoJS.enc.Utf8);
  if (!originalNote) {
    throw new Error("Неверный пароль или зашифрованная заметка.");
  }
  return originalNote;
};
