const express = require('express');
const path = require('path');
//const api = require();
const fs = require("fs");
const database = require("./db/db.json");
const { randomUUID } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//we want the application to use the index.js file
//app.use('/api', api);

app.use(express.static('public'));
console.log('read');
// GET Route for notes
//we want to get and read the data within the notes html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get("api/notes", (req, res) => { res.json(notesDB)});

app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html')) 
);


//should reload the notes and keep them updated
app.route("/notes")
    .get(function (req, res) {
        res.json(database);
})

//I want to give the id a random ID
//then I want to assign that into a newNote variable
//after that I am going to push the new note and rewrite the db.json file
app.post("/api/notes", function (req, res) {
  req.body.id = randomUUID();
  const newNote = req.body;

  database.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(database));
  res.json(database);

})

// delete function to delete any note
//then the db.json file needs to be rewritten after a note has been deleted
//going to search for the id then filter through the previous notes. The note that matched willdelete
app.delete("/api/notes/:id", function (req, res) {
  const id = req.params.id;

  database = database.filter(notes => notes.id !=id);
  fs.writeFileSync("./db/db.json", JSON.stringify(database));
  res.json(database);
})

//updates the json file whenever a note is added or deleted
        function updateDatabase() {
            fs.writeFile("db/db.json",JSON.stringify(notes,'\t'),err => {
                if (err) throw err;
                return true;
            });
        }
// GET Route for note page
app.get('*', function (req, res) {
    //we want to send this information to the public index html page.
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);