// Configuração do Knex para conexão com banco de dados
/**
 * knexfile.js
 * Configuração do Knex para conexão com banco de dados MySQL.
 *
 * Este arquivo define os parâmetros de conexão, diretórios de migrations e seeds.
 *
 * Manutenção: Atualize as variáveis de ambiente conforme necessário.
 * Última revisão: 18/08/2025
 * Autor: Equipe de Engenharia Hostly
 */
require("dotenv").config();

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./db/migrations", // Diretório das migrations
    },
    seeds: {
      directory: "./db/seeds", // Diretório dos seeds
    },
  },
};
