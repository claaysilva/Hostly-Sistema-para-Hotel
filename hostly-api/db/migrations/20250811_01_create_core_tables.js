// Migration para criar tabelas principais: users, customers, rooms
/**
 * 20250811_01_create_core_tables.js
 * Migration para criar tabelas principais: users, customers, rooms.
 *
 * Cria as tabelas essenciais do sistema Hostly e define relacionamentos.
 *
 * Manutenção: Adicione ou altere campos conforme evolução do sistema.
 * Última revisão: 18/08/2025
 * Autor: Equipe de Engenharia Hostly
 */
exports.up = async function (knex) {
  if (!(await knex.schema.hasTable("users"))) {
    await knex.schema.createTable("users", function (table) {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table
        .enum("role", ["user", "operator", "admin"])
        .notNullable()
        .defaultTo("user");
      table.timestamps(true, true);
    });
  }
  if (!(await knex.schema.hasTable("customers"))) {
    await knex.schema.createTable("customers", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().nullable().unique(); // FK para usuário
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("phone");
      table.timestamps(true, true);
    });
  }
  if (!(await knex.schema.hasTable("rooms"))) {
    await knex.schema.createTable("rooms", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.text("description");
      table.integer("capacity").notNullable();
      table.decimal("price_per_night", 10, 2).notNullable();
      table.boolean("is_available").defaultTo(true);
      table.string("image_url");
      table.timestamps(true, true);
    });
  }
};

// Remove tabelas principais
exports.down = async function (knex) {
  // Remove tabelas principais criadas por esta migration
  await knex.schema.dropTableIfExists("rooms");
  await knex.schema.dropTableIfExists("customers");
  await knex.schema.dropTableIfExists("users");
};
