import { useEffect, useState } from 'react';
import './App.css';
import NoteEditor from './NoteEditor.jsx';

function App() {
    const [forecasts, setForecasts] = useState();
    const [notes, setNotes] = useState();

    useEffect(() => {
        populateWeatherData();
    }, []);

    useEffect(() => {
        notesData();
    }, []);

    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.date}>
                        <td>{forecast.date}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.summary}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    const noteContents = notes === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Number</th>
                    <th>Title</th>
                    {/*<th>Temp. (F)</th>*/}
                    {/*<th>Summary</th>*/}
                </tr>
            </thead>
            <tbody>
                {notes.map(note =>
                    <tr key={note.number}>
                        <td>{note.number}</td>
                        <td>{note.title}</td>
                        {/*<td>{note.title}</td>*/}
                        {/*<td>{note.title}</td>*/}
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
            {noteContents}
            <div><NoteEditor/></div>
        </div>
        
    );
    
    async function populateWeatherData() {
        //const response = await fetch('weatherforecast');
        const response = await fetch('api/weatherforecast');
        console.log(response);
        const data = await response.json();
        setForecasts(data);
    }

    async function notesData() {
        const response = await fetch('api/note');
        console.log(response);
        const data = await response.json();
        setNotes(data);
    }
}

export default App;