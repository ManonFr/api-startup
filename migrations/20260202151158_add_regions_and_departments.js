/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("regions", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
  });

  await knex.schema.createTable("departments", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("code", 5).notNullable().unique();

    table
      .integer("region_id")
      .unsigned()
      .references("id")
      .inTable("regions")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("departments");
  await knex.schema.dropTableIfExists("regions");
};
