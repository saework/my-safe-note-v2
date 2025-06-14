import _find from "lodash/find";
import React, { useContext } from "react";
import { INoteRow } from "./interfaces";
import { StateContext } from "./state/notes-context";
import CryptoJS from "crypto-js";
import { db } from "./db-utils/db-config";
import { ILoginData } from "./interfaces";

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

export const getLoginData = async (
  dataType: "currentUser" | "userId" | "jwtToken" | "jwtAuthHeader"
): Promise<
  string | // для currentUser и jwtToken
  number | // для userId
  { Authorization: string } | // для jwtAuthHeader
  undefined
> => {
  try {
    // Получаем данные из IndexedDB
    const loginData = await db.get<ILoginData>('auth', 'loginData');
    
    if (!loginData) {
      return undefined;
    }

    switch (dataType) {
      case "currentUser":
        return loginData.currentUser;
      case "userId":
        return loginData.userId;
      case "jwtToken":
        return loginData.jwtToken;
      case "jwtAuthHeader":
        return loginData.jwtToken 
          ? { Authorization: `bearer ${loginData.jwtToken}` } 
          : undefined;
      default:
        return undefined;
    }
  } catch (error) {
    console.error("getLoginData - Ошибка получения loginData данных из IndexedDB:", error);
    return undefined;
  }
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
