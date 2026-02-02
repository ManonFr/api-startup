/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("users", (table) => {
    table
      .integer("region_id")
      .unsigned()
      .references("id")
      .inTable("regions")
      .onDelete("SET NULL");

    table
      .integer("department_id")
      .unsigned()
      .references("id")
      .inTable("departments")
      .onDelete("SET NULL");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("region_id");
    table.dropColumn("department_id");
  });
};
