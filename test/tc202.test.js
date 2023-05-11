const chai = require('chai')
const chaiHttp = require('chai-http')
const testDatabase = require('./test-database')
const sut = require('../index').app
const assert = chai.assert
chai.use(chaiHttp)

describe('TC-202', () => {
    // Reset database before each test
    beforeEach((done) => {
        testDatabase(done)
    })

    it('TC-202-1', (done) => {
        // Act
        chai.request(sut).get('/api/user').end((err, res) => {

            // Assert
            assert(res.body.code === 200, '200 OK must be returned')
            assert(res.body.message === 'Lijst van users', 'Correct message returned')
            assert(res.body.data.length === 3, 'Database has three users')
            for (let i = 0; i < res.body.length; i++) {
                assert(res.body.data[i].id != null, 'User info must be returned')
                assert(res.body.data[i].firstName != null, 'User info must be returned')
                assert(res.body.data[i].lastName != null, 'User info must be returned')
                assert(res.body.data[i].emailAdress != null, 'User info must be returned')
                assert(res.body.data[i].password != null, 'User info must be returned')
                assert(res.body.data[i].street != null, 'User info must be returned')
                assert(res.body.data[i].city != null, 'User info must be returned')
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
            assert(res.body.data.length === 3, 'Database has three users')
            for (let i = 0; i < res.body.length; i++) {
                assert(res.body.data[i].id != null, 'User info must be returned')
                assert(res.body.data[i].firstName != null, 'User info must be returned')
                assert(res.body.data[i].lastName != null, 'User info must be returned')
                assert(res.body.data[i].emailAdress != null, 'User info must be returned')
                assert(res.body.data[i].password != null, 'User info must be returned')
                assert(res.body.data[i].isActive != null, 'User info must be returned')
                assert(res.body.data[i].city != null, 'User info must be returned')
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
            assert(res.body.data.length === 1, 'Database has one non active user')
            assert(res.body.data[0].id === 1, 'Correct user must be returned')
            assert(res.body.data[0].firstName === 'Hendrik', 'Correct user must be returned')
            assert(res.body.data[0].lastName === 'van Dam', 'Correct user must be returned')
            assert(res.body.data[0].emailAdress === 'hvd@server.nl', 'Correct user must be returned')
            assert(res.body.data[0].password === 'PythonisbeterdanJava', 'Correct user must be returned')
            assert(res.body.data[0].isActive == false, 'Correct user must be returned')
            assert(res.body.data[0].street === 'Damstraat', 'Correct user must be returned')
            assert(res.body.data[0].city === 'Hendrikstad', 'Correct user must be returned')
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
            assert(res.body.data.length === 2, 'Database has two active users')
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
            assert(res.body.data[0].id === 1, 'Correct user must be returned')
            assert(res.body.data[0].firstName === 'Hendrik', 'Correct user must be returned')
            assert(res.body.data[0].lastName === 'van Dam', 'Correct user must be returned')
            assert(res.body.data[0].emailAdress === 'hvd@server.nl', 'Correct user must be returned')
            assert(res.body.data[0].password === 'PythonisbeterdanJava', 'Correct user must be returned')
            assert(res.body.data[0].isActive == false, 'Correct user must be returned')
            assert(res.body.data[0].street === 'Damstraat', 'Correct user must be returned')
            assert(res.body.data[0].city === 'Hendrikstad', 'Correct user must be returned')
            done()
        })
    })
})