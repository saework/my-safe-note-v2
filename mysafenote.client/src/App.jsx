import React, { useState } from 'react';
//import { Route, Switch, Redirect } from 'react-router-dom';
//import _ from 'lodash';
//import { connect } from 'react-redux';
import Main from './pages/main.jsx';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';
import NewPass from './pages/new-pass';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { useAuth } from './hooks/useAuth';
//import { history } from './store/store';
//import { IStore } from './interfaces';

// interface IProps {
//   currentUser: string;
//   jwtToken: {};
// }
// type IState = { loggedIn: boolean };
const history = createBrowserHistory();

function App(props) {
    //const { loggedIn, login, logout } = useAuth(); // Использование пользовательского хука для аутентификации
    const [loggedIn, setLoggedIn] = useState(false);

//   constructor(props: IProps) {
//     super(props);
//     this.state = { loggedIn: false };
//   }

//   componentDidMount() {
//     const { currentUser, jwtToken } = this.props;
//     if (currentUser && !_.isEmpty(jwtToken)) {
//       this.setState({ loggedIn: true });
//     } else {
//       this.setState({ loggedIn: false });
//     }
//   }

//   render() {
//     const { loggedIn } = this.state;
    return (
      <>
      {/* <Router>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<SignIn onLogin={login} />} />
                <Route path="/newpassword" element={<NewPass />} />
                <Route path="/main" element={loggedIn ? <Main onLogout={logout} /> : <Navigate to="/login" />} />
                <Route path="/" element={loggedIn ? <Navigate to="/main" /> : <Navigate to="/login" />} />
            </Routes>
        </Router> */}

        <Router>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/newpassword" element={<NewPass />} />
                <Route path="/main" element={<Main /> } />
                <Route path="/" element={loggedIn ? <Navigate to="/main" /> : <Navigate to="/login" />} />
            </Routes>
        </Router>

        {/* <Router>
          <Route history={history} path="/signup" component={SignUp} />
          <Route history={history} path="/login" component={SignIn} />
          <Route history={history} path="/newpassword" component={NewPass} />
          <Route history={history} path="/main" component={Main} />
          <Route exact path="/">
            {loggedIn ? <Navigate to="/main" /> : <SignIn />}
          </Route>
        </Router> */}
      </>
     );
//   }
}
export default App;


// const mapStateToProps = (store: IStore) => ({
//   currentUser: store.rootReducer.currentUser,
//   jwtToken: store.rootReducer.jwtToken,
// });

// export default connect(mapStateToProps)(App);





// import { useEffect, useState } from 'react';
// import './App.css';
// import NoteEditor from './NoteEditor.jsx';

// function App() {
//     const [forecasts, setForecasts] = useState();
//     const [notes, setNotes] = useState();

//     useEffect(() => {
//         populateWeatherData();
//     }, []);

//     useEffect(() => {
//         notesData();
//     }, []);

//     const contents = forecasts === undefined
//         ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
//         : <table className="table table-striped" aria-labelledby="tableLabel">
//             <thead>
//                 <tr>
//                     <th>Date</th>
//                     <th>Temp. (C)</th>
//                     <th>Temp. (F)</th>
//                     <th>Summary</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {forecasts.map(forecast =>
//                     <tr key={forecast.date}>
//                         <td>{forecast.date}</td>
//                         <td>{forecast.temperatureC}</td>
//                         <td>{forecast.temperatureF}</td>
//                         <td>{forecast.summary}</td>
//                     </tr>
//                 )}
//             </tbody>
//         </table>;

//     const noteContents = notes === undefined
//         ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
//         : <table className="table table-striped" aria-labelledby="tableLabel">
//             <thead>
//                 <tr>
//                     <th>Number</th>
//                     <th>Title</th>
//                     {/*<th>Temp. (F)</th>*/}
//                     {/*<th>Summary</th>*/}
//                 </tr>
//             </thead>
//             <tbody>
//                 {notes.map(note =>
//                     <tr key={note.number}>
//                         <td>{note.number}</td>
//                         <td>{note.title}</td>
//                         {/*<td>{note.title}</td>*/}
//                         {/*<td>{note.title}</td>*/}
//                     </tr>
//                 )}
//             </tbody>
//         </table>;

//     return (
//         <div>
//             <h1 id="tableLabel">Weather forecast</h1>
//             <p>This component demonstrates fetching data from the server.</p>
//             {contents}
//             {noteContents}
//             <div><NoteEditor/></div>
//         </div>
        
//     );
    
//     async function populateWeatherData() {
//         //const response = await fetch('weatherforecast');
//         const response = await fetch('api/weatherforecast');
//         console.log(response);
//         const data = await response.json();
//         setForecasts(data);
//     }

//     async function notesData() {
//         const response = await fetch('api/note');
//         console.log(response);
//         const data = await response.json();
//         setNotes(data);
//     }
// }

// export default App;