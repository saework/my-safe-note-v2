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
import Loader from "./components/loader";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const jwtToken = await getLoginData("jwtToken");
        setLoggedIn(jwtToken !== undefined);
      } catch (error) {
        console.error("checkAuth - Ошибка:", error);
        setLoggedIn(false);
      } finally {
        setLoading(false); // Завершаем загрузку в любом случае
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div>
        {loading && (
          <div className="loader-overlay">
            <Loader />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/newpassword" element={<NewPass />} />
          <Route path="/main" element={<Main />} />
          <Route path="/note" element={<Note />} />
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
