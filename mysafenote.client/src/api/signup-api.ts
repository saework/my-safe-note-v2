import React from "react";
import { validateEmail } from "../functions";

const signUpApi = async (
  email: string,
  password: string,
  passwordRpt: string,
  setReqMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  if (email && password && passwordRpt) {
    if (password === passwordRpt) {
      const validEmail = validateEmail(email);
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
          var loginData = {
            currentUser: email,
            userId: responseData.userId,
            jwtToken: responseData.accessToken,
          };
          // сохраняем в хранилище sessionStorage токен доступа
          localStorage.setItem("loginData", JSON.stringify(loginData));
          console.log(
            "signUpApi - Регистрация прошла успешно, loginData записан в LocalStorage"
          );
          return loginData;
        } else {
          console.log(`signUpApi - Ошибка соединения:${response.statusText}`);
          setReqMessage("Ошибка сервера");
        }
      } else {
        setReqMessage("Email имеет не верный формат!");
      }
    } else {
      setReqMessage("Пароли не совпадают!");
    }
  } else {
    setReqMessage("Заполните обязательные поля!");
  }
};

export default signUpApi;
