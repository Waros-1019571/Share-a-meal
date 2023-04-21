const express = require('express')
const assert = require('assert')

const app = express()
const port = 1337

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
}

let index = database.users.length

app.use(express.json())

//201
app.post('/api/user', (req, res) => {
    const user = req.body
    try {
        for (let i = 0; i < database.users.length; i++) {
            assert(typeof user.emailAdress === 'string', 'Het e-mailadres moet een string zijn')
            assert(user.emailAdress !== database.users[i].emailAdress, 'Het e-mailadres is al in gebruik!')
        }
        user.id = index++
        database.users.push(user)
        console.log(database)
        res.send(user)
    } catch (err) {
        console.log(err)
        res.status(400).end()
        return
    }  
})

//202
app.get('/api/user', (req, res) => {
    res.send(database.users)
})

//203
app.get('/api/user/profile', (req, res) => {
    res.send('deze functionaliteit is nog niet beschikbaar')
})

//204
app.get('/api/user/:userId', (req, res) => {
    const userId = req.params.userId
    for (let i = 0; i < database.users.length; i++) {
        if (userId === database.users[i].id.toString()) {
            res.send(database.users[i])
            return
        }
    }
    res.status(404).send('De userId komt niet overeen met een userId uit de database!')
})

//205
app.put('/api/user/:userId', (req, res) => {
    const userId = req.params.userId
    for (let i = 0; i < database.users.length; i++) {
        if (userId === database.users[i].id.toString()) {
            if (req.body.firstName != null) {
                database.users[i].firstName = req.body.firstName
            }
            if (req.body.lastName != null) {
                database.users[i].lastName = req.body.lastName
            }
            if (req.body.emailAdress != null) {
                database.users[i].emailAdress = req.body.emailAdress
            }
            if (req.body.password != null) {
                database.users[i].password = req.body.password
            }
            res.send(database.users[i])
            return
        }
    }
    res.status(404).send('De userId komt niet overeen met een userId uit de database!')
})

//206
app.delete('/api/user/:userId', (req, res) => {
    const userId = req.params.userId
    let deletePosition = null
    for (let i = 0; i < database.users.length; i++) {
        if (userId === database.users[i].id.toString()) {
            deletePosition = i
            break
        }
    }
    if (deletePosition != null) {
        database.users.splice(deletePosition, 1)
        res.send('User met ID ' + userId + ' is verwijderd!')
        return
    }
    res.status(404).send('De userId komt niet overeen met een userId uit de database!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app