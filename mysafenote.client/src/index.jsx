import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import './style.scss';
//import { ConnectedRouter } from 'connected-react-router';
import { NotesProvider } from "./state/notes-context";
//import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <Provider store={store}> */}
    <NotesProvider>
      {/* <ConnectedRouter history={history}> */}
        <App />
      {/* </ConnectedRouter> */}
    </NotesProvider>
    {/* </Provider>, */}
  </StrictMode>
);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
