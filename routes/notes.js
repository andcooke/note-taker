const notes = require('express').Router();
const uuid = require('../helpers/uuid')
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');
const db = require('../db/db.json');


// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});


// POST Route for a new note
notes.post('/', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  console.log(req.body);

  const {title, text, id} = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid()
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});


// DELETE Route to delete a note

notes.delete('/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`);
  const requestedNote = req.params.id.toLowerCase();

  for (let i = 0; i < db.length; i++) {
    if (requestedNote === db[i].id.toLowerCase()){
      db.splice(i, 1);
    }
  }
  writeToFile('./db/db.json', db);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
} )


module.exports = notes;
