import _ from "lodash";
import { getLoginData } from "../functions";
import { INoteDto, IResponseNoteDto } from "../interfaces";
import moment from 'moment-timezone';

export const loadNoteBodyFromServer = async (userId: number, noteId: number): Promise<IResponseNoteDto | undefined> => {
  const url = `api/note/notebody`;
  const jwtToken = await getLoginData("jwtToken");
  if (!_.isEmpty(jwtToken)) {
    console.log(
      `loadNoteBodyFromServer - jwtToken - ${JSON.stringify(jwtToken)}`
    );
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        userId: userId,
        noteId: noteId,
      }),
    });

    if (response.ok === true) {
      const responseData = await response.json();

      let noteData = {
        title: responseData.title,
        createDate: moment.utc(responseData.createDate).local().toDate(), // Преобразуем в локальное время
        lastChangeDate: moment.utc(responseData.lastChangeDate).local().toDate(),
        notebookName: responseData.notebookName,
        notebookId: responseData.notebookId,
        noteBody: responseData.noteBody,
        notePasswordHash: responseData.notePasswordHash,
      };
      console.log("loadNoteBodyFromServer - Получена тело и данные заметки с сервера");
      return noteData;
    } else {
      console.log(
        `loadNoteBodyFromServer - Ошибка при получении данных с сервера - ${response.statusText}`
      );
    }
  } else {
    console.log("loadNoteBodyFromServer - Не определен jwtAuthHeader!");
  }
};

  export const saveNoteToServer = async (noteData: INoteDto): Promise<number> => {
  let result = 0;
  const url = `api/note/savenote`;
  const jwtToken = await getLoginData("jwtToken");
  if (!_.isEmpty(jwtToken)) {
    console.log(`saveNoteToServer - jwtToken - ${JSON.stringify(jwtToken)}`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        noteId: noteData.noteId,
        title: noteData.title,
        createDate: noteData.createDate,
        lastChangeDate: noteData.lastChangeDate,
        notebookId: noteData.notebookId,
        noteBody: noteData.noteBody,
        notePasswordHash: noteData.notePasswordHash,
        userId: noteData.userId,
      }),
    });
    if (response.ok === true) {
      console.log("saveNoteToServer - Заметка сохранена на сервера");
      const responseData = await response.json();
      result = responseData;
    } else if (response.status === 413) {
      console.log("saveNoteToServer - Ошибка сохранения - Содержимое заметки более 10 Mb");
      alert("Содержимое заметки не должно превышать 10 Mb"); //TODO переделать на кастомный компонент Message!
    } else {
      console.log(
        `saveNoteToServer - Ошибка при сохранении заметки на сервер - ${response.statusText}`
      );
    }
  } else {
    console.log("saveNoteToServer - Не определен jwtAuthHeader!");
  }
  return result;
};

export const deleteNoteFromServer = async (noteId: number): Promise<boolean> => {
  const url = `api/note/${noteId}`;
  const jwtToken = await getLoginData("jwtToken"); 

  if (!_.isEmpty(jwtToken)) {
    console.log(
      `deleteNoteFromServer - jwtToken - ${JSON.stringify(jwtToken)}`
    );

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`,
      },
    });

    console.log(response);
    if (response.ok) {
      console.log("deleteNoteFromServer - Заметка успешно удалена с сервера");
      return true;
    } else {
      console.log(
        `deleteNoteFromServer - Ошибка при удалении заметки с сервера - ${response.statusText}`
      );
      return false;
    }
  } else {
    console.log("deleteNoteFromServer - Не определен jwtAuthHeader!");
    return false;
  }
};

export const loadNoteDocxFromServer = async (noteId: number, title: string): Promise<boolean> => {
  const url = "api/note/notedocx";
  let result = false;
  try {
    const jwtToken = await getLoginData("jwtToken");
    if (!_.isEmpty(jwtToken)) {
      console.log(
        `loadNoteDocxFromServer - jwtToken - ${JSON.stringify(jwtToken)}`
      );
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
        body: noteId.toString(),
      });

      if (!response.ok) {
        throw new Error(`${response.statusText}`);
      }
      const blob = await response.blob(); // Получаем ответ как Blob
      const docUrl = window.URL.createObjectURL(blob); // Создаем URL для скачивания
      const link = document.createElement("a");
      link.href = docUrl;
      const fileName = title + ".docx";
      link.setAttribute("download", fileName); // Имя файла для скачивания
      document.body.appendChild(link);
      link.click(); // Имитируем клик для скачивания
      link.remove(); // Удаляем ссылку из DOM
      result = true;
    } else {
      console.log("loadNoteDocxFromServer - Не определен jwtAuthHeader!");
    }
  } catch (error) {
    console.error("loadNoteDocxFromServer - Ошибка при скачивании файла:", error);
  }
  return result;
};

export const loadNotesDocxFromServer = async (userId: number): Promise<boolean> => {
  const url = "api/note/allnotedocx";
  let result = false;
  try {
    const jwtToken = await getLoginData("jwtToken");
    if (!_.isEmpty(jwtToken)) {
      console.log(`loadNotesDocxFromServer - jwtToken - ${JSON.stringify(jwtToken)}`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(userId),
      });

      if (!response.ok) {
        throw new Error(`${response.statusText}`);
      }
      const blob = await response.blob(); // Получаем ответ как Blob
      const zipUrl = window.URL.createObjectURL(blob); // Создаем URL для скачивания
      const link = document.createElement("a");
      link.href = zipUrl;
      const fileName = "Notes.zip";
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click(); // Имитируем клик для скачивания
      link.remove(); // Удаляем ссылку из DOM
      result = true;
    } else {
      console.log("loadNotesDocxFromServer - Не определен jwtAuthHeader!");
    }
  } catch (error) {
    console.error("loadNotesDocxFromServer - Ошибка при скачивании файла:", error);
  }
  return result;
};
