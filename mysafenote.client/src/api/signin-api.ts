import React from "react";
import { validateEmail } from "../functions";
import { ILoginData } from "../interfaces";
import { db } from "../db-utils/db-config";

const signInApi = async (
  email: string,
  password: string,
  setReqMessage: React.Dispatch<React.SetStateAction<string>>
): Promise<ILoginData | undefined> => {
  if (email && password) {
    const validEmail = validateEmail(email);
    if (validEmail === true) {
      try {
        const url = "api/User/login";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });
        if (response.ok === true) {
          const responseData = await response.json();

          let loginData = {
            currentUser: email,
            userId: responseData.userId,
            jwtToken: responseData.accessToken,
          };
          //localStorage.setItem('loginData', JSON.stringify(loginData)); //!!!comm
          //!!!
          console.log(loginData);
          await db.delete("auth", "loginData");
          await db.add("auth", {
            key: "loginData", // Это keyPath
            currentUser: loginData.currentUser,
            userId: loginData.userId,
            jwtToken: loginData.jwtToken, // Должно совпадать с keyPath индекса
          });

  //           await db.add("auth", {
  //   key: "loginData",
  //   currentUser: "test@test.ru",
  //   userId: 1,
  //   jwtToken: "eyJhbGci353JH4"
  // });

          //!!!
          console.log(
            "signInApi - Аутентификация прошла успешно, loginData записан в LocalStorage"
          );
          return loginData;
        } else if (response.status === 401) {
          setReqMessage("Не верный логин или пароль!");
        } else if (response.status === 404) {
          setReqMessage("Пользователь с таким логином не найден");
        } else {
          console.log(`signInApi - Ошибка соединения:${response.statusText}`);
          setReqMessage("Ошибка сервера");
        }
       //!!!
      } catch (error) {
        console.error("Ошибка при сохранении в IndexedDB:", error);
        setReqMessage("Ошибка сохранения сессии");
      }
      //!!!
    } else {
      setReqMessage("Логин имеет не верный формат!");
    }
  } else {
    setReqMessage("Заполните обязательные поля!");
  }
};

export default signInApi;
