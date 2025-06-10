import { DBHelper } from './db-helper';

export const db = new DBHelper({
  name: 'NotesAppDB',
  version: 1,
  stores: [
    {
      name: 'auth',
      keyPath: 'key',
      indexes: [
        { name: 'by_currentUser', keyPath: 'currentUser' }, 
        { name: 'by_userId', keyPath: 'userId' },
        { name: 'by_jwtToken', keyPath: 'jwtToken' } 
      ]
    },
    {
      name: 'notes',
      keyPath: 'id',
      indexes: [
        { name: 'by_userId', keyPath: 'userId' },
        { name: 'by_notebookId', keyPath: 'notebookId' }
      ]
    },
    {
      name: 'notebooks',
      keyPath: 'id',
      indexes: [
        { name: 'by_userId', keyPath: 'userId' }
      ]
    }
  ]
});