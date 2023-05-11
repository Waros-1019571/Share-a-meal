const assert = require('assert')
const logger = require('tracer').colorConsole()
const empty = require('../util/empty')
const inmemorydb = require('../util/in-memory-database')
const database = require('../util/mysql')
const whereBuilder = require('../util/where-builder')
const sqlBool = require('../util/sql-bool')

const getByIdQuery = 'SELECT * FROM `user` WHERE id = ?'

//201
const postUser = (req, res, next) => {
    logger.debug('POST /api/user aangeroepen met body: ' + JSON.stringify(req.body))
    // Section - validate info
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
        assert(typeof user.street === 'string', 'De straat moet een string zijn')
        assert(user.street.length > 0, 'De straat moet minimaal een karakter lang zijn')
        assert(typeof user.city === 'string', 'De stad moet een string zijn')
        assert(user.city.length > 0, 'De stad moet minimaal een karakter lang zijn')
    } catch (err) {
        next({
            code: 400,
            message: err.message
        })
        return
    }
    database.getConnection((err, conn) => {
        if (err) {
            logger.error(err.code, err.syscall, err.address, err.port)
            next({
                code: 500,
                message: err.code
            })
            database.releaseConnection(conn)
        }
        if (conn) {
            // Section - email exists check
            const emailExistsQuery = 'SELECT COUNT(*) AS `count` FROM `user` WHERE `emailAdress` = ?'
            conn.query(emailExistsQuery, [user.emailAdress], (err, results, fields) => {
                if (err || results[0].count == null) {
                    next({
                        code: 500,
                        message: err
                    })
                    database.releaseConnection(conn)
                    return
                }
                if (results[0].count !== 0) {
                    next({
                        code: 403,
                        message: 'Het e-mailadres is al in gebruik!'
                    })
                    database.releaseConnection(conn)
                    return
                }
                // Section - insert into
                const insertIntoQuery = 'INSERT INTO `user` (`firstName`, `lastName`, `emailAdress`, `password`, `street`, `city`, `phoneNumber`, `isActive` ) VALUES' +
                    '(?, ?, ?, ?, ?, ?, ?, 1)'
                conn.query(insertIntoQuery, [user.firstName, user.lastName, user.emailAdress, user.password, user.street, user.city, user.phoneNumber], (err, results, fields) => {
                    console.log(results.insertId)
                    if (err || !results) {
                        logger.error(err.message);
                        next({
                            code: 500,
                            message: err.message
                        })
                        database.releaseConnection(conn)
                        return
                    }
                    logger.info('User ' + results.insertId + ' toegevoegd')
                    // Section - get new user
                    conn.query(getByIdQuery, [results.insertId], (err, results, fields) => {
                        if (err || !results) {
                            logger.error(err.message);
                            next({
                                code: 500,
                                message: err.message
                            })
                            database.releaseConnection(conn)
                            return
                        }
                        res.status(201).send({
                            code: 201,
                            message: 'User toegevoegd',
                            data: results[0]
                        })
                        database.releaseConnection(conn)
                    })
                })
            })
        }
    });
}

//202
const userQuery = (req) => {
    let query = 'SELECT * FROM `user`'
    let count = 0
    // User ID filter
    if (req.body.id != null) {
        const userId = Number(req.params.userId)
        if (!isNaN(userId)) {
            logger.debug('Filtering on userId ' + id)
            query += whereBuilder('id=' + id, count++)
        }
    }
    // First name filter
    if (req.body.firstName != null && typeof req.body.firstName === 'string') {
        logger.debug('Filtering on first name ' + req.body.firstName)
        query += whereBuilder('`firstName` = \'' + req.body.firstName + '\'', count++)
    }
    // Last name filter
    if (req.body.lastName != null && typeof req.body.lastName === 'string') {
        logger.debug('Filtering on last name ' + req.body.lastName)
        query += whereBuilder('`lastName` = \'' + req.body.lastName + '\'', count++)
    }
    // Email address filter
    if (req.body.emailAdress != null && typeof req.body.emailAdress === 'string') {
        logger.debug('Filtering on email address ' + req.body.emailAdress)
        query += whereBuilder('`emailAdress` = \'' + req.body.emailAdress + '\'', count++)
    }
    // Phone number filter
    if (req.body.phoneNumber != null && typeof req.body.phoneNumber === 'string') {
        logger.debug('Filtering on phone number ' + req.body.phoneNumber)
        query += whereBuilder('`phoneNumber` = \'' + req.body.phoneNumber + '\'', count++)
    }
    // Is active filter
    if (req.body.isActive != null && typeof req.body.isActive === 'boolean') {
        logger.debug('Filtering on isActive ' + req.body.isActive)
        query += whereBuilder('`isActive` = \'' + sqlBool(req.body.isActive) + '\'', count++)
    }
    // Street filter
    if (req.body.street != null && typeof req.body.street === 'string') {
        logger.debug('Filtering on street ' + req.body.street)
        query += whereBuilder('`street` = \'' + req.body.street + '\'', count++)
    }
    // City filter
    if (req.body.city != null && typeof req.body.city === 'string') {
        logger.debug('Filtering on email address ' + req.body.city)
        query += whereBuilder('`city` = \'' + req.body.city + '\'', count++)
    }
    return query
}
const getUsers = (req, res, next) => {
    logger.debug('GET /api/user aangeroepen')
    const query = userQuery(req)
    logger.debug('Query: ' + query)
    database.getConnection((err, conn) => {
        if (err) {
            logger.error(err.code, err.syscall, err.address, err.port)
            next({
                code: 500,
                message: err.code
            })
        }
        if (conn) {
            conn.query(query, (err, results, fields) => {
                if (err) {
                    logger.error(err.message);
                    next({
                        code: 500,
                        message: err.message
                    })
                }
                if (results) {
                    logger.info('Found', results.length, 'results')
                    res.send({
                        code: 200,
                        message: 'Lijst van users',
                        data: results
                    })
                }
            })
            database.releaseConnection(conn)
        }
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
    database.getConnection((err, conn) => {
        if (err) {
            logger.error(err.code, err.syscall, err.address, err.port)
            next({
                code: 500,
                message: err.code
            })
        }
        if (conn) {
            conn.query(getByIdQuery, [userId], (err, results, fields) => {
                if (err || !results) {
                    logger.error(err.message);
                    next({
                        code: 500,
                        message: err.message
                    })
                    database.releaseConnection(conn)
                    return
                }
                if (results.length === 0) {
                    logger.warn('User ' + userId + ' is niet gevonden')
                    next({
                        code: 404,
                        message: 'De userId komt niet overeen met een userId uit de database!'
                    })
                    database.releaseConnection(conn)
                    return
                }
                res.status(200).send({
                    code: 200,
                    message: 'User gevonden',
                    data: results[0]
                })
                database.releaseConnection(conn)
            })
        }
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
        assert(user.firstName == null || typeof user.firstName === 'string', 'De voornaam moet een string zijn')
        assert(user.firstName == null || user.firstName.length !== 0, 'De voornaam moet minimaal een karakter lang zijn')
        assert(user.lastName == null || typeof user.lastName === 'string', 'De achternaam moet een string zijn')
        assert(user.lastName == null || user.lastName.length !== 0, 'De achternaam moet minimaal een karakter lang zijn')
        assert(user.password == null || typeof user.password === 'string', 'Het wachtwoord moet een string zijn')
        assert(user.password == null || user.password.length !== 0, 'Het wachtwoord moet minimaal een karakter lang zijn')
        assert(user.phoneNumber == null || typeof user.phoneNumber === 'string', 'Het telefoonnummer moet een string zijn')
        assert(user.phoneNumber == null || user.phoneNumber.length === 10, 'Het telefoonnummer moet tien karakers lang zijn')
    } catch (err) {
        next({
            code: 400,
            message: err.message
        })
        return
    }
    for (let i = 0; i < inmemorydb.users.length; i++) {
        if (userId === inmemorydb.users[i].id) {
            inmemorydb.users[i].emailAdress = user.emailAdress
            if (req.body.firstName != null) {
                inmemorydb.users[i].firstName = user.firstName
            }
            if (req.body.lastName != null) {
                inmemorydb.users[i].lastName = user.lastName
            }
            if (req.body.password != null) {
                inmemorydb.users[i].password = user.password
            }
            if (req.body.phoneNumber != null) {
                inmemorydb.users[i].phoneNumber = user.phoneNumber
            }
            logger.info('User ' + userId + ' is aangepast')
            res.send({
                code: 200,
                message: 'User bijgewerkt',
                data: inmemorydb.users[i]
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
    let deletePosition = null
    for (let i = 0; i < inmemorydb.users.length; i++) {
        if (userId === inmemorydb.users[i].id) {
            deletePosition = i
            break
        }
    }
    if (deletePosition != null) {
        inmemorydb.users.splice(deletePosition, 1)
        logger.info('User ' + userId + ' is verwijderd')
        res.send({
            code: 200,
            message: 'User met ID ' + userId + ' is verwijderd!',
            data: {}
        })
        return
    }
    logger.warn('User ' + userId + ' is niet gevonden')
    next({
        code: 404,
        message: 'De userId komt niet overeen met een userId uit de database!'
    })
}

module.exports = { postUser, getUsers, getProfile, getUser, putUser, deleteUser }