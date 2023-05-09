const chai = require('chai')
const chaiHttp = require('chai-http')
const empty = require('../src/util/empty')
const sut = require('../index').app
const assert = chai.assert
chai.use(chaiHttp)

describe('TC-204', () => {
    it('TC-204-1', (done) => {
        // Arrange
        const userID = 1
        const token = {}
        
        // Act
        chai.request(sut).get('/api/user/' + userID).send(token).end((err, res) => {
            
            // Assert
            assert(res.body.code === 401, '401 must be returned')
            assert(res.body.message === 'Deze functionaliteit is nog niet beschikbaar', 'Correct message returned')
            assert(empty(res.body.data), 'No data must be returned')
            done()
        })
    })

    it('TC-204-2', (done) => {
        // Arrange
        const userID = 99
        const token = {token:''}
        
        // Act
        chai.request(sut).get('/api/user/' + userID).send(token).end((err, res) => {
            
            // Assert
            assert(res.body.code === 404, '404 must be returned')
            assert(res.body.message === 'De userId komt niet overeen met een userId uit de database!', 'Correct message returned')
            assert(empty(res.body.data), 'No data must be returned')
            done()
        })
    })

    it('TC-204-3', (done) => {
        // Arrange
        const userID = 1
        const token = {token:''}
        
        // Act
        chai.request(sut).get('/api/user/' + userID).send(token).end((err, res) => {
            
            // Assert
            assert(res.body.code === 200, '200 OK must be returned')
            assert(res.body.message === 'User gevonden', 'Correct message returned')
            assert(res.body.data.id === userID, 'User with ID 1 returned')
            assert(res.body.data.firstName === 'Marieke', 'User info must be returned')
            assert(res.body.data.lastName === 'Jansen', 'User info must be returned')
            assert(res.body.data.emailAdress === 'm@server.nl', 'User info must be returned')
            assert(res.body.data.password === 'MaarC#isdebeste', 'User info must be returned')
            done()
        })
    })
})