const cron = require("node-cron");
const db = require("../db/connection");
const { sendReminderEmail } = require("../utils/mailer");

function getPreviousMonth() {
  const today = new Date();
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1);

  return {
    year: previousMonth.getFullYear(),
    month: previousMonth.getMonth() + 1,
  };
}

function startRevenueReminderJob() {
  // Run every day at 9AM starting from the 5th of every moonth
  cron.schedule("0 9 5-31 * *", async () => {
    try {
      const previousMonth = getPreviousMonth();
      if (
        !previousMonth ||
        typeof previousMonth.year !== "number" ||
        typeof previousMonth.month !== "number"
      ) {
        throw new Error("Invalid previous month calculation");
      }

      const year = previousMonth.year;
      const month = previousMonth.month;

      // Fetch all users with their contact info
      const users = await db("users").select(
        "id",
        "email",
        "salon_name",
        "manager_first_name",
      );

      // Fetch all revenue entries for the previous month
      const revenue = await db("revenus")
        .select("user_id")
        .where({ year, month });

      const userIdWithRevenue = revenue.map((r) => r.user_id);

      // Filter out users who have not submitted revenue
      const usersWithoutRevenue = users.filter(
        (user) => !userIdWithRevenue.includes(user.id),
      );

      await Promise.all(
        usersWithoutRevenue.map((user) =>
          sendReminderEmail(
            user.email,
            user.salon_name,
            user.manager_first_name,
            year,
            month,
          ),
        ),
      );
    } catch (err) {
      throw new Error("Revenue reminder CRON failed: " + err.message);
    }
  });
}

module.exports = startRevenueReminderJob;
