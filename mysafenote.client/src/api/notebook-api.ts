import _ from "lodash";
import { getLoginData } from "../functions";
import { INotebookDto } from "../interfaces";

export const saveNotebookToServer = async (notebookData: INotebookDto): Promise<number> => {
  const url = `api/notebook/savenotebook`;
  const jwtToken = getLoginData("jwtToken");
  let result = 0;
  if (!_.isEmpty(jwtToken)) {
    console.log(`saveNotebookToServer - jwtToken - ${JSON.stringify(jwtToken)}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken
      },
      body: JSON.stringify({
        id: notebookData.id,
        name: notebookData.name,
        userId: notebookData.userId,
      }),
    });
    if (response.ok === true) {
      const resNotebookId = await response.json();
      if (resNotebookId && resNotebookId > 0){
        console.log("saveNotebookToServer - Блокнот сохранен на сервер");
        result = resNotebookId;
        }
    } else {
      console.log(
        `saveNotebookToServer - Ошибка при сохранении блокнота на сервер - ${response.statusText}`
      );
    }
  } else {
    console.log("saveNotebookToServer - Не определен jwtAuthHeader!");
  }
  return result;
};

export const deleteNotebookFromServer = async (notebookId: number): Promise<boolean> => {
  const url = `api/notebook/${notebookId}`;
  const jwtToken = getLoginData("jwtToken");
  let result = false;
  if (!_.isEmpty(jwtToken)) {
    console.log(
      `deleteNotebookFromServer - jwtToken - ${JSON.stringify(jwtToken)}`
    );
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken
      },
    });
    if (response.ok) {
        const deletedId = await response.json();
        if (deletedId === notebookId)
        {
          console.log("deleteNotebookFromServer - Блокнот успешно удален с сервера");
          return true;
        }
    } else {
      console.log(
        `deleteNotebookFromServer - Ошибка при удалении блокнота с сервера - ${response.statusText}`
      );
    }
  } else {
    console.log("deleteNotebookFromServer - Не определен jwtAuthHeader!");
  }
  return result;
};