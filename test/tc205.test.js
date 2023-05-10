const chai = require('chai')
const chaiHttp = require('chai-http')
const empty = require('../src/util/empty')
const database = require('../src/util/in-memory-database')
const sut = require('../index').app
const assert = chai.assert
chai.use(chaiHttp)

describe('TC-205', () => {
    it('TC-205-1', (done) => {
        // Arrange
        const userID = 1
        const body = {
            'token': '',
            'firstName': 'Jon',
            'lastName': 'Snow',
            'emailAdress': '',
            'password': 'YouKnowNothingJonSnow',
            'phoneNumber': '0612345678'
        }
        
        // Act
        chai.request(sut).put('/api/user/' + userID).send(body).end((err, res) => {
            
            // Assert
            assert(res.body.code === 400, '400 must be returned')
            assert(res.body.message === 'Het e-mailadres moet minimaal een karakter lang zijn', 'Correct message')
            assert(empty(res.body.data), 'No data must be returned')
            assert(database.users[1].firstName   !== 'Jon', 'No user must be changed')
            assert(database.users[1].lastName    !== 'Snow', 'No user must be changed')
            assert(database.users[1].emailAdress !== 'jon@snow.nl', 'No user must be changed')
            assert(database.users[1].password    !== 'YouKnowNothingJonSnow' , 'No user must be changed')
            assert(database.users[1].phoneNumber !== '0612345678', 'No user must be changed')
            done()
        })
    })

    it('TC-205-2', (done) => {
        // TODO: Token must confirm user is the owner of the data
        console.log('TC-205-2 TODO')
        done()
    })

    it('TC-205-3', (done) => {
        // Arrange
        const userID = 1
        const body = {
            'token': '',
            'firstName': 'Jon',
            'lastName': 'Snow',
            'emailAdress': 'jon@snow.nl',
            'password': 'YouKnowNothingJonSnow',
            'phoneNumber': '06'
        }
        
        // Act
        chai.request(sut).put('/api/user/' + userID).send(body).end((err, res) => {
            
            // Assert
            assert(res.body.code === 400, '400 must be returned')
            assert(res.body.message === 'Het telefoonnummer moet tien karakers lang zijn', 'Correct message')
            assert(empty(res.body.data), 'No data must be returned')
            assert(database.users[1].firstName   !== 'Jon', 'No user must be changed')
            assert(database.users[1].lastName    !== 'Snow', 'No user must be changed')
            assert(database.users[1].emailAdress !== 'jon@snow.nl', 'No user must be changed')
            assert(database.users[1].password    !== 'YouKnowNothingJonSnow' , 'No user must be changed')
            assert(database.users[1].phoneNumber !== '0612345678', 'No user must be changed')
            done()
        })
    })

    it('TC-205-4', (done) => {
        // Arrange
        const userID = 99
        const body = {
            'token': '',
            'firstName': 'Jon',
            'lastName': 'Snow',
            'emailAdress': 'jon@snow.nl',
            'password': 'YouKnowNothingJonSnow',
            'phoneNumber': '0612345678'
        }
        
        // Act
        chai.request(sut).put('/api/user/' + userID).send(body).end((err, res) => {
            
            // Assert
            assert(res.body.code === 404, '404 must be returned')
            assert(res.body.message === 'De userId komt niet overeen met een userId uit de database!', 'Correct message')
            assert(empty(res.body.data), 'No data must be returned')
            assert(database.users[1].firstName   !== 'Jon', 'No user must be changed')
            assert(database.users[1].lastName    !== 'Snow', 'No user must be changed')
            assert(database.users[1].emailAdress !== 'jon@snow.nl', 'No user must be changed')
            assert(database.users[1].password    !== 'YouKnowNothingJonSnow' , 'No user must be changed')
            assert(database.users[1].phoneNumber !== '0612345678', 'No user must be changed')
            done()
        })
    })

    it('TC-205-5', (done) => {
        // Arrange
        const userID = 1
        const body = {
            'firstName': 'Jon',
            'lastName': 'Snow',
            'emailAdress': 'jon@snow.nl',
            'password': 'YouKnowNothingJonSnow',
            'phoneNumber': '0612345678'
        }
        
        // Act
        chai.request(sut).put('/api/user/' + userID).send(body).end((err, res) => {
            
            // Assert
            assert(res.body.code === 401, '401 must be returned')
            assert(res.body.message === 'Deze functionaliteit is nog niet beschikbaar', 'Correct message')
            assert(empty(res.body.data), 'No data must be returned')
            assert(database.users[1].firstName   !== 'Jon', 'No user must be changed')
            assert(database.users[1].lastName    !== 'Snow', 'No user must be changed')
            assert(database.users[1].emailAdress !== 'jon@snow.nl', 'No user must be changed')
            assert(database.users[1].password    !== 'YouKnowNothingJonSnow' , 'No user must be changed')
            assert(database.users[1].phoneNumber !== '0612345678', 'No user must be changed')
            done()
        })
    })

    it('TC-205-6', (done) => {
        // Arrange
        const userID = 1
        const body = {
            'token': '',
            'firstName': 'Jon',
            'lastName': 'Snow',
            'emailAdress': 'jon@snow.nl',
            'password': 'YouKnowNothingJonSnow',
            'phoneNumber': '0612345678'
        }
        
        // Act
        chai.request(sut).put('/api/user/' + userID).send(body).end((err, res) => {
            
            // Assert
            assert(res.body.code === 200, '200 must be returned')
            assert(res.body.message === 'User bijgewerkt', 'Correct message')
            assert(res.body.data.firstName   === 'Jon', 'Correct data returned')
            assert(res.body.data.lastName    === 'Snow', 'Correct data returned')
            assert(res.body.data.emailAdress === 'jon@snow.nl', 'Correct data returned')
            assert(res.body.data.password    === 'YouKnowNothingJonSnow' , 'Correct data returned')
            assert(res.body.data.phoneNumber === '0612345678', 'Correct data returned')
            assert(database.users[1].firstName   === 'Jon', 'The user must be changed')
            assert(database.users[1].lastName    === 'Snow', 'The user must be changed')
            assert(database.users[1].emailAdress === 'jon@snow.nl', 'The user must be changed')
            assert(database.users[1].password    === 'YouKnowNothingJonSnow' , 'The user must be changed')
            assert(database.users[1].phoneNumber === '0612345678', 'The user must be changed')
            done()
        })
    })
})
