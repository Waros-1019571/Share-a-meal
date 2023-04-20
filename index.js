const express = require('express');
const assert = require('assert');

const app = express();
const port = 1337;

let database = {
    users: [
      {
        id: 0,
        firstName: 'Hendrik',
        lastName: 'van Dam',
        emailAdress: 'hvd@server.nl',
        password: 'PythonisbeterdanJava'
      },
      {
        id: 1,
        firstName: 'Marieke',
        lastName: 'Jansen',
        emailAdress: 'm@server.nl',
        password: 'MaarC#isdebeste'
      }
    ],
};

let index = database.users.length;

app.use(express.json());

//201
app.post('/api/user', (req, res) => {
    const user = req.body;
    try {
        for (let i = 0; i < database.users.length; i++) {
            assert(typeof user.emailAdress === 'string', 'Het e-mailadres moet een string zijn')
            assert(user.emailAdress !== database.users[i].emailAdress, 'Het e-mailadres is al in gebruik!')
        }
        user.id = index++;
        database.users.push(user)
        console.log(database)
        res.send()
    } catch (err) {
        console.log(err)
        res.status(400).end();
        return;
    }  
})

//202 - 01
app.get('/api/user', (req, res) => {
    res.send(database.users)
})

//202 - 02
app.post('/api/user?field1=:value1&field2=:value', (req, res) => {
    res.send()
})

//203
app.post('/api/user/profile', (req, res) => {
    res.send()
})

//204
app.post('/api/user/:userId', (req, res) => {
    res.send()
})

//205
app.put('/api/user/:userId', (req, res) => {
    res.send()
})

//206
app.delete('/api/user/:userId', (req, res) => {
    res.send()
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;