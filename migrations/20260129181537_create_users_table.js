/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();

    table.string("salon_name").notNullable();
    table.string("salon_address").notNullable();
    table.date("opening_date").notNullable();
    table.integer("full_time_employees_count").notNullable();

    table.string("manager_first_name").notNullable();
    table.string("manager_last_name").notNullable();

    table.timestamps(true, true); // created_at and updated_at
  });
};

/**
 * @param { import("knex").Knex }
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
