const chai = require('chai')
const chaiHttp = require('chai-http')
const sut = require('../index').app
const database = require('../src/util/in-memory-database')
const assert = chai.assert
chai.use(chaiHttp)

describe('TC-206', () => {
    it('TC-206-4', (done) => {
        // Arrange
        const userCount = database.users.length
        const userID = 0

        // Act
        chai.request(sut).delete('/api/user/' + userID).end((err, res) => {
            
            // Assert
            assert(res.status === 200, '200 OK must be returned')
            assert(res.text === 'User met ID ' + userID + ' is verwijderd!', 'Correct message must be returned')
            assert(database.users.length === userCount-1, 'A user must be deleted')
            done()
        })
    })
})