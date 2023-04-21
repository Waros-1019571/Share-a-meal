const chai = require('chai')
const chaiHttp = require('chai-http')
const sut = require('../index').app
const assert = chai.assert
chai.use(chaiHttp)

describe('TC-201', () => {
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
            assert(res.status === 201, '200 Created must be returned')
            assert(res.body.id === 2, '2 must be user ID')
            assert(res.body.firstName === 'Jon', 'User info must be returned')
            assert(res.body.lastName === 'Snow', 'User info must be returned')
            assert(res.body.emailAdress === 'jon@snow.nl', 'User info must be returned')
            assert(res.body.password === 'YouKnowNothingJonSnow', 'User info must be returned')
            done()
        })
    })
})