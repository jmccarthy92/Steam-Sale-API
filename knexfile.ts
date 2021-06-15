// Update with your config settings.
require('ts-node/register');

module.exports = {

    client: "pg",
    connection: process.env.SQL_URL,
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
