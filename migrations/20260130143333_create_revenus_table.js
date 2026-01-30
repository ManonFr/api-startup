/**
 * This table stores the monthly revenue for each salon (user)
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("revenus", (table) => {
    // PK
    table.increments("id").primary();

    table.integer("user_id").unsigned().notNullable();

    table.integer("year").notNullable();
    table.integer("month").notNullable();

    table.decimal("amount", 10, 2).notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());

    // FK constraint
    // If a user is deleted, all related revenues are deleted as well
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.unique(["user_id", "year", "month"]); // Unique revenue per month and per user
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("revenus");
};
