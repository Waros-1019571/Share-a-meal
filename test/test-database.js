const database = require('../src/util/mysql')

const CLEAR_USERS_TABLE = 'DELETE FROM `user`; '
const CLEAR_DB = CLEAR_USERS_TABLE
const INSERT_USER =
    'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city`, `phoneNumber`, `isActive` ) VALUES' +
    '(1, "Hendrik", "van Dam", "hvd@server.nl", "PythonisbeterdanJava", "Damstraat", "Hendrikstad", "0612345678", 0), ' + 
    '(2, "Marieke", "Jansen", "m@server.nl", "MaarC#isdebeste", "Damstraat", "Jansendorp", "0165123456", 1), ' +
    '(3, "Japie", "Krekel", "j@krekel.nl", "Wachtwoord", "Krekellaan", "Krekel aan zee", "0611111111", 1);'

module.exports = (done) => {
    database.getConnection((err, connection) => {
        if (err) {
            done(err)
            throw err // no connection
        }
        connection.query(CLEAR_DB + INSERT_USER, (error, results, fields) => {
                if (error) {
                    done(error)
                    throw error // not connected!
                }
                database.releaseConnection(connection)
                done()
            }
        )
    })
}