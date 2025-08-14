// Seed para criar cliente e usuário de exemplo
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.seed = async function (knex) {
  const customerEmail = "cliente@exemplo.com";
  const user = await knex("users").where({ email: customerEmail }).first();

  if (!user) {
    console.log("Criando cliente e usuário de exemplo");
    const hashedPassword = await bcrypt.hash("1234", saltRounds);

    // Cria usuário e obtém o ID
    const [newUserId] = await knex("users")
      .insert({
        name: "Cliente Exemplo",
        email: customerEmail,
        password: hashedPassword,
        role: "user",
      })
      .returning("id");

    // Cria cliente vinculado ao user_id
    await knex("customers").insert({
      name: "Cliente Exemplo",
      email: customerEmail,
      phone: "21987654321",
      user_id: newUserId.id || newUserId,
    });
  }
};
