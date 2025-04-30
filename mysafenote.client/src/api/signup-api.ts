import React from "react";
import { validateEmail } from "../functions";
import { ILoginData } from "../interfaces";

const signUpApi = async (
  email: string,
  password: string,
  passwordRpt: string,
  setReqMessage: React.Dispatch<React.SetStateAction<string>>
): Promise<ILoginData | undefined> => {
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
          let loginData = {
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
        } else if (response.status === 409) {
          // setReqMessage("Уже существует пользователь с таким Email!"); //!!!comm
          setReqMessage("Уже существует пользователь с таким логином!");
        } else {
          console.log(`signUpApi - Ошибка соединения:${response.statusText}`);
          setReqMessage("Ошибка сервера");
        }
      } else {
        // setReqMessage("Email имеет не верный формат!"); //!!!comm
        setReqMessage("Логин должен содержать только английские буквы или цифры (минимум 3 символа)");
        //setReqMessage("Логин имеет не верный формат!");
      }
    } else {
      setReqMessage("Пароли не совпадают!");
    }
  } else {
    setReqMessage("Заполните обязательные поля!");
  }
};

export default signUpApi;
