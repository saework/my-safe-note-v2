import React from "react";
import { validateEmail } from "../functions";
import { ILoginData } from "../interfaces";
import { db } from "../db-utils/db-config";

const signUpApi = async (
  email: string,
  password: string,
  passwordRpt: string,
  setReqMessage: React.Dispatch<React.SetStateAction<string>>
): Promise<ILoginData | undefined> => {
  if (email && password && passwordRpt) {
    if (password === passwordRpt) {
      const validEmail = validateEmail(email);
      try {
      if (validEmail === true) {
        console.log(password);
        const url = "api/User/signup";
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

          await db.delete("auth", "loginData");
          await db.add("auth", {
            key: "loginData", //keyPath
            currentUser: loginData.currentUser,
            userId: loginData.userId,
            jwtToken: loginData.jwtToken, // Должно совпадать с keyPath индекса
          });

          console.log(
            "signUpApi - Регистрация прошла успешно, loginData записан в IndexedDB"
          );
          return loginData;
        } else if (response.status === 409) {
          setReqMessage("Уже существует пользователь с таким логином!");
        } else {
          console.log(`signUpApi - Ошибка соединения:${response.statusText}`);
          setReqMessage("Ошибка сервера");
        }
      } else {
        setReqMessage("Логин должен содержать английские буквы или цифры (минимум 3 символа)");
      }
      } catch (error) {
        console.error("Ошибка при сохранении в IndexedDB:", error);
        setReqMessage("Ошибка сохранения сессии");
      }
    } else {
      setReqMessage("Пароли не совпадают!");
    }
  } else {
    setReqMessage("Заполните обязательные поля!");
  }
};

export default signUpApi;
