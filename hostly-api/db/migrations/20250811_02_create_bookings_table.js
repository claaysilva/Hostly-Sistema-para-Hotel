/**
 * 20250811_02_create_bookings_table.js
 * Migration para criar tabela de reservas (bookings).
 *
 * Cria a tabela de reservas e define relacionamentos com quartos e clientes.
 *
 * Manutenção: Adicione ou altere campos conforme evolução do sistema.
 * Última revisão: 18/08/2025
 * Autor: Equipe de Engenharia Hostly
 */
exports.up = async function (knex) {
  if (!(await knex.schema.hasTable("bookings"))) {
    return knex.schema.createTable("bookings", (table) => {
      table.increments("id").primary();
      table.integer("room_id").unsigned().notNullable();
      table
        .foreign("room_id")
        .references("id")
        .inTable("rooms")
        .onDelete("CASCADE");
      table.integer("customer_id").unsigned().notNullable();
      table
        .foreign("customer_id")
        .references("id")
        .inTable("customers")
        .onDelete("CASCADE");
      table.date("check_in_date").notNullable();
      table.date("check_out_date").nullable();
      table
        .enum("status", ["active", "completed", "cancelled"])
        .notNullable()
        .defaultTo("active");
      table.timestamps(true, true);
    });
  }
};

// Remove tabela de reservas criada por esta migration
exports.down = async function (knex) {
  return knex.schema.dropTableIfExists("bookings");
};
