import _ from "lodash";
//import React from 'react';
import React, { useContext } from "react";
import { getLoginData } from "../functions";

export const saveNotebookToServer = async function (notebookData) {
  //const url = `api/note/notebody/${noteId}`;
  //const url = `api/note/notebody`;
  const url = `api/notebook/savenotebook`;
  const jwtToken = getLoginData("jwtToken");
  let result = false;
  if (!_.isEmpty(jwtToken)) {
    console.log(`saveNotebookToServer - jwtToken - ${JSON.stringify(jwtToken)}`);
    //console.log(notebookData);
    //console.log(noteDto);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: notebookData.id,
        name: notebookData.name,
        userId: notebookData.userId,
      }),
    });
    //console.log(response);
    if (response.ok === true) {
      //console.log(response);
      //const noteBody = await response.json();
      console.log("Блокнот сохранен на сервер");
      //console.log(data);
      result = true;
    } else {
      console.log(
        `Ошибка при сохранении блокнота на сервер - ${response.statusText}`
      );
    }
  } else {
    console.log("saveNotebookToServer - Не определен jwtAuthHeader!");
  }
  return result;
};

export const deleteNotebookFromServer = async function (notebookId) {
  const url = `api/notebook/${notebookId}`;
  const jwtToken = getLoginData("jwtToken"); // Получаем токен аутентификации
  let result = false;
  if (!_.isEmpty(jwtToken)) {
    console.log(
      `deleteNotebookFromServer - jwtToken - ${JSON.stringify(jwtToken)}`
    );

    const response = await fetch(url, {
      method: "DELETE", // Указываем метод DELETE
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken, // Передаем токен в заголовке
      },
    });
    //console.log(response);
    if (response.ok) {
        const deletedId = await response.json();
        if (deletedId === notebookId)
        {
          console.log("Блокнот успешно удален с сервера");
          return true; // Возвращаем true, если удаление прошло успешно
        }
    } else {
      console.log(
        `Ошибка при удалении блокнота с сервера - ${response.statusText}`
      );
    }
  } else {
    console.log("deleteNotebookFromServer - Не определен jwtAuthHeader!");
  }
  return result;
};