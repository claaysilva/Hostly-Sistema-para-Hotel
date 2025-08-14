// Script para criar o banco de dados caso não exista
const knex = require("knex");
const knexConfig = require("../knexfile");

const config = knexConfig.development;
const dbName = config.connection.database;

// Conexão temporária sem banco definido
const knexInstance = knex({
  client: config.client,
  connection: {
    host: config.connection.host,
    user: config.connection.user,
    password: config.connection.password,
    charset: "utf8",
  },
});

async function createDatabase() {
  try {
    await knexInstance.raw("CREATE DATABASE IF NOT EXISTS ??", [dbName]);
    console.log(`Banco de dados '${dbName}' criado ou já existente.`);
  } catch (error) {
    console.error(`Falha ao criar o banco de dados '${dbName}':`, error);
    process.exit(1);
  } finally {
    await knexInstance.destroy();
  }
}

createDatabase();
