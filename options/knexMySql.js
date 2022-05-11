const knexMySql = require("knex")({
    client: "mysql",
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'productos'
    },
    pool: {min:0, max: 10}
});
module.exports = { knexMySql };