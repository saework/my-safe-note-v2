import _ from "lodash";
import { getLoginData } from "../functions";
import { INoteRow, INotebook } from "../interfaces";
import moment from 'moment-timezone';

export const loadNotesDataFromServer = async (
  userId: number
): Promise<INoteRow[] | undefined> => {
  const jwtToken = await getLoginData("jwtToken");
  console.log(jwtToken);
  if (userId === 0 || !userId) userId = Number(await getLoginData("userId"));

  if (!_.isEmpty(jwtToken) && userId > 0) {
    console.log(
      `loadNotesDataFromServer - userId = ${userId} jwtToken = ${JSON.stringify(
        jwtToken
      )}`
    );
    
    const url = `api/note/userid/${userId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + jwtToken,
      },
    });
    if (response.ok === true) {
      const data: INoteRow[] = await response.json();
      console.log("loadNotesDataFromServer - Получены данные с сервера");
      // Преобразуем строки в объекты Date
      const resultData: INoteRow[] = data.map((note) => ({
        ...note,
        createDate: moment.utc(note.createDate).local().toDate(), // Преобразуем в локальное время
        lastChangeDate: moment.utc(note.lastChangeDate).local().toDate(),
      }));
      return resultData;

    } else if (response.status === 401) {
          console.log("loadNotesDataFromServer - Ошибка. Пользователь не авторизован");
    } else {
      console.log(
        `loadNotesDataFromServer - Ошибка при получении данных с сервера - ${response.statusText}`
      );
    }
  } else {
    console.log(
      "loadNotesDataFromServer - Ошибка. Не определены значения loginData (userId или jwtToken)"
    );
  }
};

export const loadNotebooksDataFromServer = async (
  userId: number
): Promise<INotebook[] | undefined> => {
  const jwtToken = await getLoginData("jwtToken");
  if (userId === 0 || !userId) userId = Number(await getLoginData("userId"));

  if (!_.isEmpty(jwtToken) && userId > 0) {
    console.log(
      `loadNotebooksDataFromServer - userId = ${userId} jwtToken = ${JSON.stringify(
        jwtToken
      )}`
    );

    const url = `api/notebook/userid/${userId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + jwtToken,
      },
    });
    if (response.ok === true) {
      const data: INotebook[] = await response.json();
      console.log("loadNotebooksDataFromServer - Получены данные с сервера");
      return data;

    } else if (response.status === 401) {
    console.log("loadNotebooksDataFromServer - Ошибка. Пользователь не авторизован");

    } else {
      console.log(
        `loadNotebooksDataFromServer - Ошибка при получении данных с сервера - ${response.statusText}`
      );
    }
  } else {
    console.log(
      "loadNotebooksDataFromServer - Ошибка. Не определены значения loginData (userId или jwtToken)"
    );
  }
};

export const exportNotesFromServer = async (userId: number): Promise<void> => {
  try {
    const jwtToken = await getLoginData("jwtToken");
    if (userId === 0 || !userId) userId = Number(await getLoginData("userId"));

    if (!_.isEmpty(jwtToken) && userId > 0) {
      console.log(
        `exportNotesFromServer - userId = ${userId} jwtToken = ${JSON.stringify(
          jwtToken
        )}`
      );

      const response = await fetch(`/api/Note/export/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("exportNotesFromServer - Ошибка при выгрузке заметок");
      }

      let fileName = "notes_backup.zip"; // Значение по умолчанию
      const blob = await response.blob();

      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // Имя файла для скачивания
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Освобождаем память
    } else {
      console.log(
        "exportNotesFromServer - Ошибка. Не определены значения loginData (userId или jwtToken)"
      );
    }
  } catch (error) {
    console.error("exportNotesFromServer - Ошибка:", error);
  }
};

export const importNotesToServer = async (
  userId: number,
  file: File
): Promise<boolean> => {
  let result = false;
  try {
    const jwtToken = await getLoginData("jwtToken");
    if (userId === 0 || !userId) userId = Number(await getLoginData("userId"));

    if (!_.isEmpty(jwtToken) && userId > 0) {
      console.log(
        `importNotesToServer - userId = ${userId} jwtToken = ${JSON.stringify(
          jwtToken
        )}`
      );

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/Note/import/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("importNotesToServer - Ошибка при загрузке заметок");
      }
      console.log("importNotesToServer - Заметки успешно загружены");
      result = true;
    } else {
      console.log(
        "exportNotesFromServer - Ошибка. Не определены значения loginData (userId или jwtToken)"
      );
    }
  } catch (error) {
    console.error(
      "importNotesToServer - Не удалось загрузить заметки. Ошибка:",
      error
    );
  }
  return result;
};
