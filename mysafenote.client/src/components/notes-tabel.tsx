import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment-timezone';

const NotesTable = React.memo(({ notes, onEdit, onDelete, currentPage, pageSize }) => {
  return (
    <Table responsive="sm">
      <thead>
        <tr>
          <th>№</th>
          <th>Название</th>
          <th>Изменено</th>
          <th>Создано</th>
          <th>Редактировать</th>
          <th>Удалить</th>
        </tr>
      </thead>
      <tbody>
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <tr key={note.id}>
              <td>{index + 1 + currentPage * pageSize}</td>
              <td>{note.title}</td>
              <td>{moment.utc(note.lastChangeDate).format("DD.MM.YYYY HH:mm")}</td>
              <td>{moment.utc(note.createDate).format("DD.MM.YYYY HH:mm")}</td>
              <td>
                <button onClick={() => onEdit(note.id)}>Edit</button>
              </td>
              <td>
                <button onClick={() => onDelete(note.id)}>Delete</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6}>Список пуст</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
});

export default NotesTable;