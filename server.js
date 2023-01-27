const express = require('express');
const path = require('path');
//const api = require();
const fs = require("fs");
const database = require("./db/db.json")

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



//should reload the notes and keep them updated
app.route("/notes")
    .get(function (req, res) {
        res.json(database);
})

.post(function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    let newNote = req.body;

    //only want 99 to be the max amount of notes the user can put
    let idLimit = 99;   

    //this will give the max note the same id, that way the user wouldnt be able to create more, and the limit will work
    for (let i = 0; i < database.length; i++) {
        let individualNote = database[i];
        if (individualNote > idLimit) {
            idLimit = individualNote.id;
        }
    }
    //this will give each note an id number
    newNote.id = idLimit + 1;
    database.push(newNote)
    //this will update the database with the note.
    //this will update the json file and write the information the user types to it
    fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Your note has been Successfully Saved!");
    });
    res.json(newNote);
});

// delete function to delete any note
//then the db.json file needs to be rewritten after a note has been deleted
app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join (__dirname, "/db/db.json");
    for (let i = 0; i < database.length; i++) {
        if (database[i].id == req.params.id) {
            database.splice(i, 1);
        break;

    }
}
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {
        if (err) {
            return console.log(err);
        } else {
            console.log(" Your note has been successfully deleted! ");
        }
    });
    res.json(database);
});

// GET Route for note page
app.get('*', function (req, res) {
    //we want to send this information to the public index html page.
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);