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

exports.down = async function (knex) {
  return knex.schema.dropTableIfExists("bookings");
};
