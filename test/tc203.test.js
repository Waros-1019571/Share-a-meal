const chai = require('chai')
const chaiHttp = require('chai-http')
const testDatabase = require('./test-database')
const empty = require('../src/util/empty')
const sut = require('../index').app
const assert = chai.assert
chai.use(chaiHttp)

describe('TC-203', () => {
    // Reset database before each test
    beforeEach((done) => {
        testDatabase(done)
    })

    it('TC-203-1', (done) => {
        // Arrange
        const token = {}

        // Act
        chai.request(sut).get('/api/user/profile').send(token).end((err, res) => {
            
            // Assert
            assert(res.body.code === 401, '401 must be returned')
            assert(res.body.message === 'Deze functionaliteit is nog niet beschikbaar', 'Message must be returned')
            assert(empty(res.body.data), 'No data must be returned')
            console.log(res.body.message) // Functionality not yet implemented, there is nothing yet to test
            done()
        })
    })

    it('TC-203-2', (done) => {
        // Arrange
        const token = {token: ''}

        // Act
        chai.request(sut).get('/api/user/profile').send(token).end((err, res) => {
            
            // Assert
            assert(res.body.code === 200, '200 OK must be returned')
            assert(res.body.message === 'Deze functionaliteit is nog niet beschikbaar', 'Message must be returned')
            assert(empty(res.body.data), 'No data must be returned')
            console.log(res.body.message) // Functionality not yet implemented, there is nothing yet to test
            done()
        })
    })
})