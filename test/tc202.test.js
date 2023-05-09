const chai = require('chai')
const chaiHttp = require('chai-http')
const sut = require('../index').app
const assert = chai.assert
chai.use(chaiHttp)

describe('TC-202', () => {
    it('TC-202-1', (done) => {
        // Act
        chai.request(sut).get('/api/user').end((err, res) => {
            
            // Assert
            assert(res.body.code === 200, '200 OK must be returned')
            assert(res.body.data.length >= 2, 'In-memory database starts with two users')
            console.log('Users in database: ' + res.body.length)
            for (let i = 0; i < res.body.length; i++) {
                assert(res.body.data[i].id != null, 'User info must be returned')
                assert(res.body.data[i].firstName != null, 'User info must be returned')
                assert(res.body.data[i].lastName != null, 'User info must be returned')
                assert(res.body.data[i].emailAdress != null, 'User info must be returned')
                assert(res.body.data[i].password != null, 'User info must be returned')
            }
            done()
        })
    })
})