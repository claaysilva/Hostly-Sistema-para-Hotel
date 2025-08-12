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
