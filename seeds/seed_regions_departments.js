/**
 * Seed file to insert regions and departments
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const path = require("path");

  // Load the JSON file containing the full geographic data
  const data = require(
    path.join(__dirname, "../data/fr_regions_departments.json"),
  );

  // Clear existinf data to avoid duplicates
  await knex("departments").del();
  await knex("regions").del();

  // Loop through each region in the JSON data
  for (const region of data) {
    // Insert the region and get its generated ID
    const [insertedRegion] = await knex("regions")
      .insert({ name: region.region_name })
      .returning("id");

    // Some databases return an object, other return a raw value
    const regionId = insertedRegion.id || insertedRegion;

    // Insert all departments related to the current region
    for (const department of region.departments) {
      await knex("departments").insert({
        name: department.name,
        code: department.code,
        region_id: regionId,
      });
    }
  }
};
