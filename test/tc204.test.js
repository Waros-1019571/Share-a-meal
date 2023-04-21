const chai = require('chai')
const chaiHttp = require('chai-http')
const sut = require('../index').app
const assert = chai.assert
chai.use(chaiHttp)

describe('TC-204', () => {
    it('TC-204-3', (done) => {
        // Arrange
        const userID = 1
        
        // Act
        chai.request(sut).get('/api/user/' + userID).end((err, res) => {
            
            // Assert
            assert(res.status === 200, '200 OK must be returned')
            assert(res.body.id === userID, 'User with ID 1 returned')
            assert(res.body.firstName === 'Marieke', 'User info must be returned')
            assert(res.body.lastName === 'Jansen', 'User info must be returned')
            assert(res.body.emailAdress === 'm@server.nl', 'User info must be returned')
            assert(res.body.password === 'MaarC#isdebeste', 'User info must be returned')
            done()
        })
    })
})