const knexSqlite3 = require("knex")({
    client: 'sqlite3',
    connection: {
        filename: "./DB/ecommerce.sqlite"
    },
    useNullAsDefault: true
})

module.exports = {knexSqlite3};