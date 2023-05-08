const assert = require('assert')
const logger = require('tracer').colorConsole()
const database = require('../util/in-memory-database')
let index = database.users.length

//201
const postUser = (req, res) => {
    logger.debug('POST /api/user aangeroepen met body: ' + JSON.stringify(req.body))
    const user = req.body
    try {
        assert(typeof user.emailAdress === 'string', 'Het e-mailadres moet een string zijn')
        assert(user.emailAdress.length !== 0, 'Het e-mailadres moet minimaal een karakter lang zijn')
        assert(typeof user.firstName === 'string', 'De voornaam moet een string zijn')
        assert(user.firstName.length !== 0, 'De voornaam moet minimaal een karakter lang zijn')
        assert(typeof user.lastName === 'string', 'De achternaam moet een string zijn')
        assert(user.lastName.length !== 0, 'De achternaam moet minimaal een karakter lang zijn')
        assert(typeof user.password === 'string', 'Het wachtwoord moet een string zijn')
        assert(user.password.length !== 0, 'Het wachtwoord moet minimaal een karakter lang zijn')
        for (let i = 0; i < database.users.length; i++) {
            assert(user.emailAdress !== database.users[i].emailAdress, 'Het e-mailadres is al in gebruik!')    
        }
    } catch (err) {
        logger.error(err.message)
        res.status(400).end(err.message)
        return
    }
    database.users.push({
        id: index++,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAdress: user.emailAdress,
        password: user.password,
    })
    logger.info('User ' + user.id + ' toegevoegd')
    res.status(201).send(user)
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
    const userId = Number(req.params.userId)
    try {
        assert(!isNaN(userId), 'Het Id moet een nummer zijn')
        assert(userId >= 0, 'Het id moet minimaal \'0\' zijn')
    } catch (err) {
        logger.error(err.message)
        res.status(400).end(err.message)
        return
    }
    for (let i = 0; i < database.users.length; i++) {
        if (userId === database.users[i].id) {
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
    const userId = Number(req.params.userId)
    const user = req.body
    try {
        assert(!isNaN(userId), 'Het Id moet een nummer zijn')
        assert(userId >= 0, 'Het id moet minimaal \'0\' zijn')
        assert(user.emailAdress == null || typeof user.emailAdress === 'string', 'Het e-mailadres moet een string zijn')
        assert(user.emailAdress == null || user.emailAdress.length !== 0, 'Het e-mailadres moet minimaal een karakter lang zijn')
        assert(user.firstName == null   || typeof user.firstName === 'string', 'De voornaam moet een string zijn')
        assert(user.firstName == null   || user.firstName.length !== 0, 'De voornaam moet minimaal een karakter lang zijn')
        assert(user.lastName == null    || typeof user.lastName === 'string', 'De achternaam moet een string zijn')
        assert(user.lastName == null    || user.lastName.length !== 0, 'De achternaam moet minimaal een karakter lang zijn')
        assert(user.password == null    || typeof user.password === 'string', 'Het wachtwoord moet een string zijn')
        assert(user.password == null    || user.password.length !== 0, 'Het wachtwoord moet minimaal een karakter lang zijn')
    } catch (err) {
        logger.error(err.message)
        res.status(400).end(err.message)
        return
    }
    for (let i = 0; i < database.users.length; i++) {
        if (userId === database.users[i].id) {
            if (req.body.firstName != null) {
                database.users[i].firstName = user.firstName
            }
            if (req.body.lastName != null) {
                database.users[i].lastName = user.lastName
            }
            if (req.body.emailAdress != null) {
                database.users[i].emailAdress = user.emailAdress
            }
            if (req.body.password != null) {
                database.users[i].password = user.password
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
    const userId = Number(req.params.userId)
    try {
        assert(!isNaN(userId), 'Het Id moet een nummer zijn')
        assert(userId >= 0, 'Het id moet minimaal \'0\' zijn')
    } catch (err) {
        logger.error(err.message)
        res.status(400).end(err.message)
        return
    }
    let deletePosition = null
    for (let i = 0; i < database.users.length; i++) {
        if (userId === database.users[i].id) {
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