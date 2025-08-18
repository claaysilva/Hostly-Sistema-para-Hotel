// Seed para criar usuário admin padrão
/**
 * 01_add_admin_user.js
 * Seed para criar usuário admin padrão no banco de dados.
 *
 * Executa inserção do usuário admin caso não exista, com senha padrão criptografada.
 *
 * Manutenção: Altere o e-mail ou senha conforme política de segurança.
 * Última revisão: 18/08/2025
 * Autor: Equipe de Engenharia Hostly
 */
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.seed = async function (knex) {
  const adminEmail = "admin@hostly.com";
  const adminUser = await knex("users").where({ email: adminEmail }).first();

  if (!adminUser) {
    console.log(`Criando usuário admin padrão: ${adminEmail}`);
    const hashedPassword = await bcrypt.hash("1234", saltRounds);
    await knex("users").insert({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });
  }
};
