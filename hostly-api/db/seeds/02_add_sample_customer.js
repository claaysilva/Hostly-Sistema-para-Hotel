// Seed para criar cliente e usuário de exemplo
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.seed = async function (knex) {
  const customerEmail = "cliente@exemplo.com";
  const user = await knex("users").where({ email: customerEmail }).first();

  if (!user) {
    console.log("Criando cliente e usuário de exemplo");
    const hashedPassword = await bcrypt.hash("1234", saltRounds);

    /**
     * Cria usuário e obtém o ID.
     * Insere um novo usuário no banco de dados e retorna seu ID.
     */
    const [newUserId] = await knex("users")
      .insert({
        name: "Cliente Exemplo",
        email: customerEmail,
        password: hashedPassword,
        role: "user",
      })
      .returning("id");

    /**
     * Cria cliente vinculado ao user_id.
     * Insere um novo cliente no banco de dados associado ao ID do usuário.
     */
    await knex("customers").insert({
      name: "Cliente Exemplo",
      email: customerEmail,
      phone: "21987654321",
      user_id: newUserId.id || newUserId,
    });
  }
};
