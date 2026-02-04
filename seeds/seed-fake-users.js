require("dotenv").config();
const db = require("../db/connection");
const bcrypt = require("bcryptjs");

/**
 * This script seeds fake users for testing:
 * - 3 users per department
 * - 1 to 3 revenue entries per user
 */
async function seedFakeUsers() {
  console.log("Seeding fake users...");

  // Sample department IDs (from different regions)
  const departmentIds = [75, 13, 33, 59, 46, 19, 69, 92];
  const usersPerDepartment = 3;

  let counter = 1;

  for (const departmentId of departmentIds) {
    for (let i = 1; i <= usersPerDepartment; i++) {
      const email = `user-${departmentId}-${i}@example.com`;

      // Skip if user already exists
      const existing = await db("users").where({ email }).first();
      if (existing) {
        console.log(`User ${email} already exists. Skipping.`);
        continue;
      }

      // Hash a default password
      const hashedPassword = await bcrypt.hash("Test1234!", 10);

      // Create the user
      const insertedUser = await db("users")
        .insert({
          email,
          password: hashedPassword,
          salon_name: `Salon ${counter}`,
          salon_address: `${counter} Beauty Street`,
          opening_date: "2022-01-01",
          full_time_employees_count: 2 + (counter % 4),
          manager_first_name: "Testy",
          manager_last_name: `User${counter}`,
          department_id: departmentId,
        })
        .returning("id");

      const userId = insertedUser[0].id;
      counter++;

      // Generate 1 to 3 monthly revenues
      const numberOfEntries = Math.floor(Math.random() * 3) + 1;
      const today = new Date();

      for (let j = 0; j < numberOfEntries; j++) {
        const date = new Date(today.getFullYear(), today.getMonth() - j - 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const amount = Math.floor(Math.random() * 4000) + 1000;

        // Avoid duplicate entry for the same month
        const existingRevenue = await db("revenus")
          .where({ user_id: userId, year, month })
          .first();

        if (!existingRevenue) {
          await db("revenus").insert({
            user_id: userId,
            year,
            month,
            amount,
          });
        }
      }

      console.log(`Created ${email} with ${numberOfEntries} revenues`);
    }
  }

  console.log("Fake user seed completed");
  process.exit();
}

// Run the script
seedFakeUsers().catch((err) => {
  console.error("Error seeding fake users:", err);
  process.exit(1);
});
