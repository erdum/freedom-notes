import Dexie from 'dexie';

export const db = new Dexie('FreedomNotes');

db.version(1).stores({
  notes: 'id, title, createdAt, updatedAt, folderId',
  notesIndex: 'id',
  notesDeleteIndex: 'id',
  folders: 'id, name',
  foldersIndex: 'id',
  foldersDeleteIndex: 'id',
});
