const chai = require('chai')
const chaiHttp = require('chai-http')
const empty = require('../src/util/empty')
const sut = require('../index').app
const assert = chai.assert
chai.use(chaiHttp)

describe('TC-206', () => {

    it('TC-206-1', (done) => {
        // Arrange
        const userID = 99
        const token = {'token': ''}
        
        // Act
        chai.request(sut).delete('/api/user/' + userID).send(token).end((err, res) => {
            
            // Assert
            assert(res.body.code === 404, '404 must be returned')
            assert(res.body.message === 'De userId komt niet overeen met een userId uit de database!', 'Correct message')
            assert(empty(res.body.data), 'No data must be returned')
            done()
        })
    })

    it('TC-206-2', (done) => {
        // Arrange
        const userID = 1
        const token = {}
        
        // Act
        chai.request(sut).delete('/api/user/' + userID).send(token).end((err, res) => {
            
            // Assert
            assert(res.body.code === 401, '401 must be returned')
            assert(res.body.message === 'Deze functionaliteit is nog niet beschikbaar', 'Correct message')
            assert(empty(res.body.data), 'No data must be returned')
            done()
        })
    })

    it('TC-206-3', (done) => {
        // TODO: Token must confirm user is the owner of the data
        console.log('TC-206-3 TODO')
        done()
    })

    it('TC-206-4', (done) => {
        // Arrange
        const userID = 1
        const token = {'token': ''}

        // Act
        chai.request(sut).delete('/api/user/' + userID).send(token).end((err, res) => {
            
            // Assert
            assert(res.body.code === 200, '200 OK must be returned')
            assert(res.body.message === 'User met ID ' + userID + ' is verwijderd!', 'Correct message must be returned')
            assert(empty(res.body.data), 'No data must be returned')
            done()
        })
    })
})