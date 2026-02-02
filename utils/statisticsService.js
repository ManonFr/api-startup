const db = require("../db/connection");

/**
 * Inserts or updates a row in the statistics table
 * @param {string} scope - "france" | "region" | "department"
 * @param {number|null} regionId
 * @param {number|null} departmentId
 * @param {number} average
 */
async function upsertStat(scope, regionId, departmentId, average) {
  // Avoid inserting null averages
  if (average === null) return;

  // Check if entry exists
  const existing = await db("statistics")
    .where({ scope, region_id: regionId, department_id: departmentId })
    .first();

  if (existing) {
    // Update existing row
    await db("statistics")
      .where({ id: existing.id })
      .update({ average_revenue: average, updated_at: db.fn.now() });
  } else {
    // Insert new row
    await db("statistics").insert({
      scope,
      region_id: regionId,
      department_id: departmentId,
      average_revenue: average,
    });
  }
}

/**
 * Recalculates and updates the average revenue for France,
 * the user's region, and the user's department.
 * @param {number} userId - The ID of the user who submitted revenue
 */
async function updateStatistics(userId) {
  // Fetch the user's department and region
  const user = await db("users")
    .join("departments", "users.department_id", "departments.id")
    .select("users.id", "users.department_id", "departments.region_id")
    .where("users.id", userId)
    .first();

  if (!user) {
    throw new Error("L'utilisateur n'a pas été trouvé.");
  }

  const { region_id, department_id } = user;

  // Calculate national average
  const nationalCount = await db("revenus").count("* as count").first();
  if (Number(nationalCount.count) >= 2) {
    const [{ avg: nationalAvg }] = await db("revenus").avg("amount as avg");
    await upsertStat("france", null, null, Number(nationalAvg));
  }

  // Calculate regional average
  const regionalCount = await db("revenus")
    .join("users", "revenus.user_id", "users.id")
    .join("departments", "users.department_id", "departments.id")
    .where("departments.region_id", region_id)
    .count("* as count")
    .first();

  if (Number(regionalCount.count) >= 2) {
    const [{ avg: regionalAvg }] = await db("revenus")
      .join("users", "revenus.user_id", "users.id")
      .join("departments", "users.department_id", "departments.id")
      .where("departments.region_id", region_id)
      .avg("revenus.amount as avg");

    await upsertStat("region", region_id, null, Number(regionalAvg));
  }

  // Calculate departmental average
  const departmentCount = await db("revenus")
    .join("users", "revenus.user_id", "users.id")
    .where("users.department_id", department_id)
    .count("* as count")
    .first();

  if (Number(departmentCount.count) >= 2) {
    const [{ avg: departmentAvg }] = await db("revenus")
      .join("users", "revenus.user_id", "users.id")
      .where("users.department_id", department_id)
      .avg("revenus.amount as avg");

    await upsertStat("department", null, department_id, Number(departmentAvg));
  }
}

module.exports = {
  updateStatistics,
};
