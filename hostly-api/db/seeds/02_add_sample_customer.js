// db/seeds/02_add_sample_customer.js
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.seed = async function (knex) {
  const customerEmail = "cliente@exemplo.com";
  const user = await knex("users").where({ email: customerEmail }).first();

  if (!user) {
    console.log("Criando cliente e usuário de exemplo");
    const hashedPassword = await bcrypt.hash("1234", saltRounds);

    // 1. Cria o usuário primeiro e pega o ID
    const [newUserId] = await knex("users")
      .insert({
        name: "Cliente Exemplo",
        email: customerEmail,
        password: hashedPassword,
        role: "user",
      })
      .returning("id");

    // 2. Cria o cliente correspondente, ligando com o user_id
    await knex("customers").insert({
      name: "Cliente Exemplo",
      email: customerEmail,
      phone: "21987654321",
      user_id: newUserId.id || newUserId, // Usa o ID retornado
    });
  }
};
