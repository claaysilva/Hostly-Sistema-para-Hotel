// hostly-api/db/setup.js

const knex = require('knex');
const knexConfig = require('../knexfile');

// Usamos a configuração de desenvolvimento do nosso knexfile
const config = knexConfig.development;
const dbName = config.connection.database;

// Criamos uma conexão temporária sem especificar o banco de dados
const knexInstance = knex({
  client: config.client,
  connection: {
    host: config.connection.host,
    user: config.connection.user,
    password: config.connection.password,
    charset: 'utf8',
  },
});

async function createDatabase() {
  try {
    // Usamos knex.raw() para executar um comando SQL puro
    // O '??' é um "identificador" seguro no Knex para nomes de tabelas/bancos
    await knexInstance.raw('CREATE DATABASE IF NOT EXISTS ??', [dbName]);
    console.log(`Banco de dados '${dbName}' criado ou já existente.`);
  } catch (error) {
    console.error(`Falha ao criar o banco de dados '${dbName}':`, error);
    // Encerra o processo com erro se não conseguir criar o banco
    process.exit(1);
  } finally {
    // É crucial destruir a conexão para que o script termine
    await knexInstance.destroy();
  }
}

// Executa a função
createDatabase();