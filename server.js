const express = require('express');
const path = require('path');
//db.json file on back end that will be used to store and retrieve notes using the fs module
const fs = require('fs');
//helper method for generating unique ids
const uuid = require('uuid');

//db.json file on back end that will be used to store and retrieve notes using the fs module
const notesData = require ('./db/db.json');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static());

//1.  GET /notes should return the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile('./public/notes.html')
});
//2.  GET * should return the index.html file
app.get('/', (req, res) => {
  res.sendFile('./public/index.html')
});


//CREATE API ROUTES:
//1.  GET /api/notes should read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req,res) => res.json(notesData));
//2.  POST /api/notes should receive a new note to save on the request body, 

//and then return the new note to the client.
app.post('api/notes', (req, res) => {
console.info(`${req.method} request received to add a note`);
//Destructuring assignment for the items in req.body
const { title, text } = req.body;
//If all the required properties are present
if (title && text) {
  const newNote = {
    title,
    text,
    note_id: uuid(),
  };
//Obtain existing notes
fs.readFile('./db/db.json','utf8', (err, data) => {
  if (err) {
    console.error(err);
  }
  else {
    const parsedNotes = JSON.parse(data);

    //Add a new note to db.json file
    parsedNotes.push(newNote);
  fs.writeFile(
    './db/db.json',
    JSON.stringify(parsedNotes, null, 4),
    (writeErr) =>
    writeErr
    ? console.error(writeErr)
    :console.info('Successfully updated notes!')
  )
  }
})
const response = {
  status: "success",
  body: newNote,
};

console.log(response);
res.status(201).json(response);
} else {
res.status(500).json("Error in posting new note");
}
}
);
//BONUS:
//1. DELETE api/notes/:id
//you'll need to read all notes from the db.json file,
//remove the note with the given id property, and then rewrite the notes
//to the db.json file

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);


