const express = require('express');
const path = require('path');
const api = require();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//we want the application to use the index.js file
app.use('/api', api);

app.use(express.static('public'));
console.log('read');
// GET Route for notes
//we want to get and read the data within the notes html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for note page
app.get('*', (req, res) =>
    //we want to send this information to the public index html page.
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);