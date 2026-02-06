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
  // Runs at 9AM on the 5th, 9th, 13th, 17th, 21st, 25th, and 29th of every month
  // Used to send reminder emails every 4 days starting from the 5th
  cron.schedule("0 9 5,9,13,17,21,25,29 * *", async () => {
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
