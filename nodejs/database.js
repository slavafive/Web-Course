const Pool = require('pg').Pool
const pool = new Pool({
    user: 'vaceslavefimov',
    password: '123',
    host: 'localhost',
    port: 5432,
    database: 'weather'
})

module.exports = pool