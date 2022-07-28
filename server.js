//requiring the express package
const express = require("express");
//requiring path package
const path = require("path");
//db.json file on back end that will be used to store and retrieve notes using the fs module
const fs = require("fs");
//helper method for generating unique ids
const { v4: uuid } = require("uuid"); //destructured v4 from the package and renamed it 'uuid'

//db.json file on back end that will be used to store and retrieve notes using the fs module
const notesData = require("./db/db.json");

//heroku port or 3001
const PORT = process.env.PORT || 3001;

//app is the express function
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

//GET /notes should return the notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(__dirname + "/public/notes.html");
});
//GET * should return the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//GET /api/notes should read the db.json file and return all saved notes as JSON
app.get(
  "/api/notes",
  (
    req,
    res
  ) =>
  //reading the json file and sending it unless there is an error.
    fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
      res.send(data); 
      }
    })
);

//POST /api/notes should receive a new note to save on the request body, and then return the new note to the client.
app.post("/api/notes", (req, res) => {
  //Consoling the Post method
  console.log(`${req.method} request received to add a note`);
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
    fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        //Add a new note to db.json file
        parsedNotes.push(newNote);
        fs.writeFile(
          __dirname + "/db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated notes!")
        );
      }
    });
    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting new note");
  }
});
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
