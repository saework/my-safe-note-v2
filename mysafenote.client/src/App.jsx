import React, { useState } from 'react';
import Main from './pages/main.jsx';
import SignIn from './pages/sign-in.jsx';
import SignUp from './pages/sign-up.jsx';
import NewPass from './pages/new-pass.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Note from './pages/note.jsx';

function App(props) {
    const [loggedIn, setLoggedIn] = useState(false);

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