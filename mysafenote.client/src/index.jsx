import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import './style.scss';
import { NotesProvider } from "./state/notes-context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotesProvider>
        <App />
    </NotesProvider>
  </StrictMode>
);