const chai = require('chai')
const chaiHttp = require('chai-http')
const database = require('../src/util/in-memory-database')
const empty = require('../src/util/empty')
const sut = require('../index').app
const assert = chai.assert
chai.use(chaiHttp)

describe('TC-201', () => {
    it('TC-201-1', (done) => {
        // Arrange
        const userCount = database.users.length
        const user = {
            'firstName': 'Jon',
            'lastName': 'Snow',
            'emailAdress': '',
            'password': 'YouKnowNothingJonSnow'
        }

        // Act
        chai.request(sut).post('/api/user').send(user).end((err, res) => {
            
            // Assert
            assert(res.body.code === 400, '400 must be returned')
            assert(res.body.message === 'Het e-mailadres moet minimaal een karakter lang zijn', 'Correct message')
            assert(empty(res.body.data), 'No data must be returned')
            assert(database.users.length === userCount, 'No user must be added')
            done()
        })
    })

    it('TC-201-2', (done) => {
        // Arrange
        const userCount = database.users.length
        const user = {
            'firstName': 'Jon',
            'lastName': 'Snow',
            'emailAdress': 'jon.nl',
            'password': 'YouKnowNothingJonSnow'
        }

        // Act
        chai.request(sut).post('/api/user').send(user).end((err, res) => {
            
            // Assert
            assert(res.body.code === 400, '400 must be returned')
            assert(res.body.message === 'Ongeldig e-mailadres', 'Correct message')
            assert(empty(res.body.data), 'No data must be returned')
            assert(database.users.length === userCount, 'No user must be added')
            done()
        })
    })

    it('TC-201-3', (done) => {
        // Arrange
        const userCount = database.users.length
        const user = {
            'firstName': 'Jon',
            'lastName': 'Snow',
            'emailAdress': 'jon@snow.nl',
            'password': ''
        }

        // Act
        chai.request(sut).post('/api/user').send(user).end((err, res) => {
            
            // Assert
            assert(res.body.code === 400, '400 must be returned')
            assert(res.body.message === 'Het wachtwoord moet minimaal een karakter lang zijn', 'Correct message')
            assert(empty(res.body.data), 'No data must be returned')
            assert(database.users.length === userCount, 'No user must be added')
            done()
        })
    })

    it('TC-201-4', (done) => {
        // Arrange
        const userCount = database.users.length
        const user = {
            'firstName': 'Jon',
            'lastName': 'Snow',
            'emailAdress': 'm@server.nl',
            'password': 'YouKnowNothingJonSnow'
        }

        // Act
        chai.request(sut).post('/api/user').send(user).end((err, res) => {
            
            // Assert
            assert(res.body.code === 403, '403 must be returned')
            assert(res.body.message === 'Het e-mailadres is al in gebruik!', 'Correct message')
            assert(empty(res.body.data), 'No data must be returned')
            assert(database.users.length === userCount, 'No user must be added')
            done()
        })
    })

    it('TC-201-5', (done) => {
        // Arrange
        const user = {
            'firstName': 'Jon',
            'lastName': 'Snow',
            'emailAdress': 'jon@snow.nl',
            'password': 'YouKnowNothingJonSnow'
        }

        // Act
        chai.request(sut).post('/api/user').send(user).end((err, res) => {
            
            // Assert
            assert(res.body.code === 201, '200 Created must be returned')
            assert(res.body.message === 'User toegevoegd', 'Correct message returned')
            assert(res.body.data.id === 2, '2 must be user ID')
            assert(res.body.data.firstName === 'Jon', 'User info must be returned')
            assert(res.body.data.lastName === 'Snow', 'User info must be returned')
            assert(res.body.data.emailAdress === 'jon@snow.nl', 'User info must be returned')
            assert(res.body.data.password === 'YouKnowNothingJonSnow', 'User info must be returned')
            assert(res.body.data.isActive === true, 'User must be active')
            done()
        })
    })
})