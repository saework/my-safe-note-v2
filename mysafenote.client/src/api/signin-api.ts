import React from "react";
import { validateEmail } from "../functions";
import { ILoginData } from "../interfaces";

const signInApi = async (
  email: string,
  password: string,
  setReqMessage: React.Dispatch<React.SetStateAction<string>>
): Promise<ILoginData | undefined> => {
  if (email && password) {
    const validEmail = validateEmail(email);
    if (validEmail === true) {
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
          jwtToken: responseData.accessToken 
        }
        localStorage.setItem('loginData', JSON.stringify(loginData));
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
    } else {
      setReqMessage("Email имеет не верный формат!");
    }
  } else {
    setReqMessage("Заполните обязательные поля!");
  }
};

export default signInApi;
