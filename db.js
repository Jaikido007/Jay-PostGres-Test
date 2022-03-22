const {Client} = require('pg/lib');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'jason.mullen',
    password: 'Password123',
    port: 5432,
});

client.connect();

module.exports = client;