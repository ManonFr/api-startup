/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("statistics", (table) => {
    table.increments("id").primary();

    // Scope of the statistic: "france", "region", or "department"
    table.string("scope").notNullable();

    // Nullable region ID for regional stats
    table.integer("region_id").unsigned().nullable();

    // Nullable department ID for departmental stats
    table.integer("department_id").unsigned().nullable();

    // Average revenue for the given scope
    table.decimal("average_revenue", 10, 2).notNullable();

    // Timestamp of the last update
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Enforce uniqueness per scope/region/department combo
    table.unique(["scope", "region_id", "department_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("statistics");
};
