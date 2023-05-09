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
            assert(res.body.message === 'Lijst van users', 'Correct message returned')
            assert(res.body.data.length >= 2, 'In-memory database starts with two users')
            console.log('Users in database: ' + res.body.data.length)
            for (let i = 0; i < res.body.length; i++) {
                assert(res.body.data[i].id != null, 'User info must be returned')
                assert(res.body.data[i].firstName != null, 'User info must be returned')
                assert(res.body.data[i].lastName != null, 'User info must be returned')
                assert(res.body.data[i].emailAdress != null, 'User info must be returned')
                assert(res.body.data[i].password != null, 'User info must be returned')
                assert(res.body.data[i].isActive != null, 'User info must be returned')
            }
            done()
        })
    })

    it('TC-202-2', (done) => {
        // Arrange
        const search = {
            'gender': 'M'
        };

        // Act
        chai.request(sut).get('/api/user').send(search).end((err, res) => {
            
            // Assert
            assert(res.body.code === 200, '200 OK must be returned')
            assert(res.body.message === 'Lijst van users', 'Correct message returned')
            assert(res.body.data.length >= 2, 'In-memory database starts with two users')
            console.log('Users in database: ' + res.body.data.length)
            for (let i = 0; i < res.body.length; i++) {
                assert(res.body.data[i].id != null, 'User info must be returned')
                assert(res.body.data[i].firstName != null, 'User info must be returned')
                assert(res.body.data[i].lastName != null, 'User info must be returned')
                assert(res.body.data[i].emailAdress != null, 'User info must be returned')
                assert(res.body.data[i].password != null, 'User info must be returned')
                assert(res.body.data[i].isActive != null, 'User info must be returned')
            }
            done()
        })
    })

    it('TC-202-3', (done) => {
        // Arrange
        const search = {
            'isActive': false
        };

        // Act
        chai.request(sut).get('/api/user').send(search).end((err, res) => {
            
            // Assert
            assert(res.body.code === 200, '200 OK must be returned')
            assert(res.body.message === 'Lijst van users', 'Correct message returned')
            assert(res.body.data.length === 1, 'In-memory database has one non active user')
            assert(res.body.data[0].id != null, 'User info must be returned')
            assert(res.body.data[0].firstName != null, 'User info must be returned')
            assert(res.body.data[0].lastName != null, 'User info must be returned')
            assert(res.body.data[0].emailAdress != null, 'User info must be returned')
            assert(res.body.data[0].password != null, 'User info must be returned')
            assert(res.body.data[0].isActive === false, 'User is not active')
            done()
        })
    })

    it('TC-202-4', (done) => {
        // Arrange
        const search = {
            'isActive': true
        };

        // Act
        chai.request(sut).get('/api/user').send(search).end((err, res) => {
            
            // Assert
            assert(res.body.code === 200, '200 OK must be returned')
            assert(res.body.message === 'Lijst van users', 'Correct message returned')
            for (let i = 0; i < res.body.length; i++) {
                assert(res.body.data[i].id != null, 'User info must be returned')
                assert(res.body.data[i].firstName != null, 'User info must be returned')
                assert(res.body.data[i].lastName != null, 'User info must be returned')
                assert(res.body.data[i].emailAdress != null, 'User info must be returned')
                assert(res.body.data[i].password != null, 'User info must be returned')
                assert(res.body.data[i].isActive === true, 'User is active')
            }
            done()
        })
    })

    it('TC-202-5', (done) => {
        // Arrange
        const search = {
            firstName: 'Hendrik',
            lastName: 'van Dam'
        };

        // Act
        chai.request(sut).get('/api/user').send(search).end((err, res) => {
            
            // Assert
            assert(res.body.code === 200, '200 OK must be returned')
            assert(res.body.message === 'Lijst van users', 'Correct message returned')
            assert(res.body.data[0].id === 0, 'Correct user must be returned')
            assert(res.body.data[0].firstName === 'Hendrik', 'Correct user must be returned')
            assert(res.body.data[0].lastName === 'van Dam', 'Correct user must be returned')
            assert(res.body.data[0].emailAdress === 'hvd@server.nl', 'Correct user must be returned')
            assert(res.body.data[0].password === 'PythonisbeterdanJava', 'Correct user must be returned')
            assert(res.body.data[0].isActive === false, 'Correct user must be returned')
            done()
        })
    })
})