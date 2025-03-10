// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.js";
// import './style.scss';
// import { NotesProvider } from "./state/notes-context.js";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <NotesProvider>
//         <App />
//     </NotesProvider>
//   </StrictMode>
// );

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import './style.scss';
import { NotesProvider } from "./state/notes-context";

const rootElement = document.getElementById("root") as HTMLElement;

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <NotesProvider>
        <App />
      </NotesProvider>
    </StrictMode>
  );
}