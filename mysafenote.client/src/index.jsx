import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import './style.scss';
import { NotesProvider } from "./state/notes-context";

// Убираем вывод логов на проде.
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
}  //!!!раском!!
//console.log(process.env.NODE_ENV);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotesProvider>
        <App />
    </NotesProvider>
  </StrictMode>
);
