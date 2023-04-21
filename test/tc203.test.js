const chai = require('chai')
const chaiHttp = require('chai-http')
const sut = require('../index').app
const assert = chai.assert
chai.use(chaiHttp)

describe('TC-203', () => {
    it('TC-203-2', (done) => {
        // Act
        chai.request(sut).get('/api/user/profile').end((err, res) => {
            
            // Assert
            assert(res.status === 200, '200 OK must be returned')
            assert(res.text != null, 'Message must be returned')
            console.log(res.text) // Functionality not yet implemented, there is nothing yet to test
            done()
        })
    })
})