import React, { useState } from 'react';
import Main from './pages/main';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';
import NewPass from './pages/new-pass';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Note from './pages/note.js';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);  //!!!обработать!!

    return (
      <>
        <Router>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/newpassword" element={<NewPass />} />
                <Route path="/main" element={<Main /> } />
                <Route path="/note" element={<Note /> } />
                <Route path="/" element={loggedIn ? <Navigate to="/main" /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
      </>
     );
}
export default App;