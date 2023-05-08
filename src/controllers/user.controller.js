const assert = require('assert')
const logger = require('tracer').colorConsole()
const database = require('../util/in-memory-database')
let index = database.users.length

//201
const postUser = (req, res) => {
    logger.debug('POST /api/user aangeroepen met body: ' + JSON.stringify(req.body))
    const user = req.body
    try {
        for (let i = 0; i < database.users.length; i++) {
            assert(typeof user.emailAdress === 'string', 'Het e-mailadres moet een string zijn')
            assert(user.emailAdress !== database.users[i].emailAdress, 'Het e-mailadres is al in gebruik!')
        }
        user.id = index++
        database.users.push(user)
        logger.info('User ' + user.id + ' toegevoegd')
        res.status(201).send(user)
    } catch (err) {
        logger.error(err.message)
        res.status(400).end(err.message)
    }
}

//202
const getUsers = (req, res) => {
    logger.debug('GET /api/user aangeroepen')
    res.send(database.users)
}

//203
const getProfile = (req, res) => {
    logger.debug('GET /api/user/profile aangeroepen')
    res.send('Deze functionaliteit is nog niet beschikbaar')
}

//204
const getUser = (req, res) => {
    logger.debug('GET /api/user/:userId aangeroepen met userId: ' + req.params.userId)
    const userId = req.params.userId
    for (let i = 0; i < database.users.length; i++) {
        if (userId === database.users[i].id.toString()) {
            res.send(database.users[i])
            return
        }
    }
    logger.warn('User ' + userId + ' is niet gevonden')
    res.status(404).send('De userId komt niet overeen met een userId uit de database!')
}

//205
const putUser = (req, res) => {
    logger.debug('PUT /api/user/:userId aangeroepen met userId: ' + req.params.userId + ' en body: ' + JSON.stringify(req.body))
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
            logger.info('User ' + userId + ' is aangepast')
            res.send(database.users[i])
            return
        }
    }
    logger.warn('User ' + userId + ' is niet gevonden')
    res.status(404).send('De userId komt niet overeen met een userId uit de database!')
}

//206
const deleteUser = (req, res) => {
    logger.debug('DELETE /api/user/:userId aangeroepen met userId: ' + req.params.userId)
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
        logger.info('User ' + userId + ' is verwijderd')
        res.send('User met ID ' + userId + ' is verwijderd!')
        return
    }
    logger.warn('User ' + userId + ' is niet gevonden')
    res.status(404).send('De userId komt niet overeen met een userId uit de database!')
}

module.exports = {postUser, getUsers, getProfile, getUser, putUser, deleteUser}