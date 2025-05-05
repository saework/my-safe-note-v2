import React, { useState, useEffect } from "react";
import Main from "./pages/main";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import NewPass from "./pages/new-pass";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Note from "./pages/note.js";
import { getLoginData } from "./functions";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const jwtToken = getLoginData("jwtToken");
    if (jwtToken) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/newpassword" element={<NewPass />} />
          <Route path="/main" element={<Main />} />
          <Route path="/note" element={<Note />} />
          {/* <Route path="/main" element={loggedIn ? <Main /> : <Navigate to="/login" />} />
          <Route path="/note" element={loggedIn ? <Note /> : <Navigate to="/login" />} /> */}
          <Route
            path="/"
            element={
              loggedIn ? <Navigate to="/main" /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </>
  );
}
export default App;
