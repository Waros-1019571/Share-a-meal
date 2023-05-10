const assert = require('assert')
const logger = require('tracer').colorConsole()
const empty = require('../util/empty')
const database = require('../util/in-memory-database')
let index = database.users.length

//201
const postUser = (req, res, next) => {
    logger.debug('POST /api/user aangeroepen met body: ' + JSON.stringify(req.body))
    const user = req.body
    try {
        assert(typeof user.emailAdress === 'string', 'Het e-mailadres moet een string zijn')
        assert(user.emailAdress.length > 0, 'Het e-mailadres moet minimaal een karakter lang zijn')
        assert(user.emailAdress.includes('@'), 'Ongeldig e-mailadres')
        assert(typeof user.firstName === 'string', 'De voornaam moet een string zijn')
        assert(user.firstName.length > 0, 'De voornaam moet minimaal een karakter lang zijn')
        assert(typeof user.lastName === 'string', 'De achternaam moet een string zijn')
        assert(user.lastName.length > 0, 'De achternaam moet minimaal een karakter lang zijn')
        assert(typeof user.password === 'string', 'Het wachtwoord moet een string zijn')
        assert(user.password.length > 0, 'Het wachtwoord moet minimaal een karakter lang zijn')
        assert(typeof user.phoneNumber === 'string', 'Het telefoonnummer moet een string zijn')
        assert(user.phoneNumber.length === 10, 'Het telefoonnummer moet tien karakers lang zijn')
        for (let i = 0; i < database.users.length; i++) {
            assert(user.emailAdress !== database.users[i].emailAdress, 'Het e-mailadres is al in gebruik!')    
        }
    } catch (err) {
        if (err.message === 'Het e-mailadres is al in gebruik!') {
            next({
                code: 403,
                message: err.message
            })
        } else {
            next({
                code: 400,
                message: err.message
            })
        }
        return
    }
    user.id = index++
    user.isActive = true
    database.users.push({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAdress: user.emailAdress,
        password: user.password,
        phoneNumber: user.phoneNumber,
        isActive: user.isActive
    })
    logger.info('User ' + user.id + ' toegevoegd')
    res.status(201).send({
        code: 201,
        message: 'User toegevoegd',
        data: user
    })
}

//202
const getUsers = (req, res) => {
    logger.debug('GET /api/user aangeroepen')
    let users = database.users
    // User ID filter
    if (req.body.userId != null) {
        const userId = Number(req.params.userId)
        if (!isNaN(userId)) {
            logger.debug('Filtering on userId ' + userId)
            users = users.filter(user => user.id === userId)
        }
    }
    // First name filter
    if (req.body.firstName != null && typeof req.body.firstName === 'string') {
        logger.debug('Filtering on first name ' + req.body.firstName)
        users = users.filter(user => user.firstName === req.body.firstName)
    }
    // Last name filter
    if (req.body.lastName != null && typeof req.body.lastName === 'string') {
        logger.debug('Filtering on last name ' + req.body.lastName)
        users = users.filter(user => user.lastName === req.body.lastName)
    }
    // Email address filter
    if (req.body.emailAdress != null && typeof req.body.emailAdress === 'string') {
        logger.debug('Filtering on email address ' + req.body.emailAdress)
        users = users.filter(user => user.emailAdress === req.body.emailAdress)
    }
     // Phone number filter
     if (req.body.phoneNumber != null && typeof req.body.phoneNumber === 'string') {
        logger.debug('Filtering on phone number ' + req.body.phoneNumber)
        users = users.filter(user => user.phoneNumber === req.body.phoneNumber)
    }
    // Is active filter
    if (req.body.isActive != null && typeof req.body.isActive === 'boolean') {
        logger.debug('Filtering on isActive ' + req.body.isActive)
        users = users.filter(user => user.isActive === req.body.isActive)
    }
    res.send({
        code: 200,
        message: 'Lijst van users',
        data: users
    })
}

//203
const getProfile = (req, res, next) => {
    logger.debug('GET /api/user/profile aangeroepen')
    if (empty(req.body) || req.body.token == null) {
        next({
            code: 401,
            message: 'Deze functionaliteit is nog niet beschikbaar'
        })
    } else {
        next({
            code: 200,
            message: 'Deze functionaliteit is nog niet beschikbaar'
        })
    }
}

//204
const getUser = (req, res, next) => {
    logger.debug('GET /api/user/:userId aangeroepen met userId: ' + req.params.userId)
    if (empty(req.body) || req.body.token == null) {
        next({
            code: 401,
            message: 'Deze functionaliteit is nog niet beschikbaar'
        })
        return
    }
    const userId = Number(req.params.userId)
    try {
        assert(!isNaN(userId), 'Het Id moet een nummer zijn')
        assert(userId >= 0, 'Het id moet minimaal \'0\' zijn')
    } catch (err) {
        next({
            code: 400,
            message: err.message
        })
        return
    }
    for (let i = 0; i < database.users.length; i++) {
        if (userId === database.users[i].id) {
            res.send({
                code: 200,
                message: 'User gevonden',
                data: database.users[i]
            })
            return
        }
    }
    logger.warn('User ' + userId + ' is niet gevonden')
    next({
        code: 404,
        message: 'De userId komt niet overeen met een userId uit de database!'
    })
}

//205
const putUser = (req, res, next) => {
    logger.debug('PUT /api/user/:userId aangeroepen met userId: ' + req.params.userId + ' en body: ' + JSON.stringify(req.body))
    if (empty(req.body) || req.body.token == null) {
        next({
            code: 401,
            message: 'Deze functionaliteit is nog niet beschikbaar'
        })
        return
    }
    const userId = Number(req.params.userId)
    const user = req.body
    try {
        assert(!isNaN(userId), 'Het Id moet een nummer zijn')
        assert(userId >= 0, 'Het id moet minimaal \'0\' zijn')
        assert(typeof user.emailAdress === 'string', 'Het e-mailadres moet een string zijn')
        assert(user.emailAdress.length !== 0, 'Het e-mailadres moet minimaal een karakter lang zijn')
        assert(user.firstName == null   || typeof user.firstName === 'string', 'De voornaam moet een string zijn')
        assert(user.firstName == null   || user.firstName.length !== 0, 'De voornaam moet minimaal een karakter lang zijn')
        assert(user.lastName == null    || typeof user.lastName === 'string', 'De achternaam moet een string zijn')
        assert(user.lastName == null    || user.lastName.length !== 0, 'De achternaam moet minimaal een karakter lang zijn')
        assert(user.password == null    || typeof user.password === 'string', 'Het wachtwoord moet een string zijn')
        assert(user.password == null    || user.password.length !== 0, 'Het wachtwoord moet minimaal een karakter lang zijn')
        assert(user.phoneNumber == null || typeof user.phoneNumber === 'string', 'Het telefoonnummer moet een string zijn')
        assert(user.phoneNumber == null || user.phoneNumber.length === 10, 'Het telefoonnummer moet tien karakers lang zijn')
    } catch (err) {
        next({
            code: 400,
            message: err.message
        })
        return
    }
    for (let i = 0; i < database.users.length; i++) {
        if (userId === database.users[i].id) {
            database.users[i].emailAdress = user.emailAdress
            if (req.body.firstName != null) {
                database.users[i].firstName = user.firstName
            }
            if (req.body.lastName != null) {
                database.users[i].lastName = user.lastName
            }
            if (req.body.password != null) {
                database.users[i].password = user.password
            }
            if (req.body.phoneNumber != null) {
                database.users[i].phoneNumber = user.phoneNumber
            }
            logger.info('User ' + userId + ' is aangepast')
            res.send({
                code: 200,
                message: 'User bijgewerkt',
                data: database.users[i]
            })
            return
        }
    }
    logger.warn('User ' + userId + ' is niet gevonden')
    next({
        code: 404,
        message: 'De userId komt niet overeen met een userId uit de database!'
    })
}

//206
const deleteUser = (req, res, next) => {
    logger.debug('DELETE /api/user/:userId aangeroepen met userId: ' + req.params.userId)
    const userId = Number(req.params.userId)
    try {
        assert(!isNaN(userId), 'Het Id moet een nummer zijn')
        assert(userId >= 0, 'Het id moet minimaal \'0\' zijn')
    } catch (err) {
        next({
            code: 400,
            message: err.message
        })
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
        res.send({
            code: 200,
            message: 'User met ID ' + userId + ' is verwijderd!',
            data: {}
        })
        return
    }
    logger.warn('User ' + userId + ' is niet gevonden')
    res.status(404).send({
        code: 404,
        message: 'De userId komt niet overeen met een userId uit de database!',
        data: {}
    })
}

module.exports = {postUser, getUsers, getProfile, getUser, putUser, deleteUser}