const express = require('express');
const db = require('./data/db');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

//App stable
app.get('/', (req, res) => {
    res.send('App loaded');
});

//Add a new user
app.post('/api/users', (req, res) => {
    let user = req.body;
    console.log('Sent User: ', user);

    if (!user.name || !user.bio) {
        res.status(400).json({
            errorMessage: 'Please provide name and bio for the user',
        });
    }

    db.insert(user)
        .then(data => {
            console.log('Returned Data: ', data);
            res.status(200).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:
                    'There was an error while saving the user to the database',
            });
        });
});

//Get all the users
app.get('/api/users', (req, res) => {
    db.find()
        .then(data => res.json(data))
        .catch(err =>
            res
                .status(500)
                .json({ error: 'The users information could not be retrieved' })
        );
});

//Get a specific user
app.get('/api/users/:id', (req, res) => {
    let { id } = req.params;
    //console.log(req);
    db.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist',
                });
            }
            res.json(user);
        })
        .catch(err =>
            res
                .status(500)
                .json({ error: 'The user information could not be retrieved' })
        );
});

//Delete a user

app.delete('/api/users/:id', (req, res) => {
    let { id } = req.params;

    db.remove(id)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist',
                });
            }
            res.json(user);
        })
        .catch(err =>
            res.status(500).json({ message: 'the user could not be removed' })
        );
});

app.put('/api/users/:id', (req, res) => {
    let { id } = req.params;
    let user = req.body;

    if (!user.name || !user.bio) {
        res.status(400).json({
            errorMessage: 'Please provide name and bio for the user.',
        });
    }

    db.update(id, user)
        .then(data => {
            if (!data) {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist.',
                });
            }
            res.status(200).json(user);
        })
        .catch(err =>
            res
                .status(500)
                .json({ error: 'The user informatino could not be modified' })
        );
});

app.listen(8080);
