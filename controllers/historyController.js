const db = require("../db/connection");

// Get revenue history for the authenticated user
async function getHistory(req, res) {
  const userId = req.user.id;

  try {
    const revenue = await db("revenus")
      .select("year", "month", "amount")
      .where({ user_id: userId })
      .orderBy([
        { column: "year", order: "desc" },
        { column: "month", order: "desc" },
      ]);

    return res.status(200).json(revenue);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

module.exports = { getHistory };
