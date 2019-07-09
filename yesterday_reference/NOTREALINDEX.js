const express = require('express');
const server = express();
server.use(express.json());

const db = require('./data/db.js');

// POST
server.post('/api/users/', (req, res) => {
    const userInfo = req.body;

    db.insert(userInfo)
        .then(user => {
            if (userInfo.name === undefined || userInfo.bio === undefined) {
                res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
            } else {
                res.status(201).json(user);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the user to the database" });
        })
})

// GET ALL
server.get('/api/users/', function (req, res) {
    
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            res.status(500).json({ error: "The users information could not be retrieved." });
        })
})

// GET BY ID
server.get('/api/users/:id', function (req, res) {
    const { id } = req.params;

    db.findById(id)
        .then(user => {
            if (user === undefined) {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            } else {
                res.status(200).json(user);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The user information could not be retrieved." });
        })
})

// DELETE
server.delete('/api/users/:id', function (req, res) {
    const { id } = req.params;

    db.remove(id)
        .then(response => {
            if (response === 0) {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            } else {
                res.status(200).json(response);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The user could not be removed" });
        })
})

// PUT
server.put('/api/users/:id', (req, res) => {
    const userInfo = req.body;
    const { id } = req.params;

    db.update(id, userInfo)
        .then(response => {
            if (userInfo.name === undefined || userInfo.bio === undefined) {
                res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
            } else if (response === 0) {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            } else {
                res.status(200).json(response);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The user information could not be modified." });
        })
})

const port = 5000;
server.listen(port, () => console.log(`running on port ${port}`));


