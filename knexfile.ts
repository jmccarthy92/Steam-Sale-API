// Update with your config settings.
require('ts-node/register');

module.exports = {

    client: "pg",
    connection:
    // process.env.SQL_URL, //||
    'postgres://localhost:5432/steam_sale_app',
    pool: {
      min: 0,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'migrations'
    },
    seeds: {
      directory: 'seeds',
    } 
};
