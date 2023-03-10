// npm i express //


// Using value of the port environment variable or 3001 if not set //
const PORT = process.env.PORT || 3001;

// using fs module to provide interface for reading and writing files //
const fs = require("fs");

// using path module to provide utilities for working with file and directory paths //
const path = require("path");

// express module to create a server //
const express = require("express");


const app = express();


// store notes in db.json file //
const allNotes = require("./db/db.json");

// Middleware to parse incoming JSON data in the request body
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static("public"));

// Route for getting all notes
app.get("/api/notes", (req, res) => {
  res.json(allNotes.slice(1));
});

// Route for serving the landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Route for serving the notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/note_app.html"));
});

// Route for handling all other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Helper function for creating a new note
function createNewNote(body, notesArray) {
  const newNote = body;

  // Initialize notesArray if it's not an array
  if (!Array.isArray(notesArray)) {
    notesArray = [];
  }

  // Initialize the id counter if the notesArray is empty
  if (notesArray.length === 0) {
    notesArray.push(0);
  }

  // Assign a unique id to the new note
  body.id = notesArray[0];
  notesArray[0]++;

  // Add the new note to the notesArray
  notesArray.push(newNote);

  // Write the updated notesArray to the db.json file
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesArray, null, 2)
  );

  // Return the new note
  return newNote;
}

// Route for creating a new note
app.post("/api/notes", (req, res) => {
  const newNote = createNewNote(req.body, allNotes);
  res.json(newNote);
});

// Helper function for deleting a note
function deleteNote(id, notesArray) {
  // Find the note with the specified id
  for (let i = 0; i < notesArray.length; i++) {
    let note = notesArray[i];

    if (note.id == id) {
      // Remove the note from the notesArray
      notesArray.splice(i, 1);

      // Write the updated notesArray to the db.json file
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesArray, null, 2)
      );

      break;
    }
  }
}

// Route for deleting a note
app.delete("/api/notes/:id", (req, res) => {
  deleteNote(req.params.id, allNotes);
  res.json(true);
});

// Start the Express.js server
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
