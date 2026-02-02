const db = require("../db/connection");
const { updateStatistics } = require("../utils/statisticsService");

// GET /revenue history for the authenticated user
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

// POST /revenue (create new entry for the previous month)
async function createRevenueEntry(req, res) {
  const userId = req.user.id;
  const { amount } = req.body;

  // Validate amount
  if (amount === undefined || isNaN(amount) || amount < 0) {
    return res.status(400).json({ error: "Montant manquant ou non valide." });
  }

  // Calculate the previous month
  const today = new Date();
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1);
  const year = previousMonth.getFullYear();
  const month = previousMonth.getMonth() + 1;

  try {
    // Prevent duplicate entry for the same user and month
    const existing = await db("revenus")
      .where({ user_id: userId, year, month })
      .first();

    if (existing) {
      return res
        .status(409)
        .json({ error: "Les revenus du mois précédent ont déjà été envoyés." });
    }

    // Insert the new revenue record
    await db("revenus").insert({
      user_id: userId,
      year,
      month,
      amount,
    });

    // Recalculate statistics for France, region and department
    await updateStatistics(userId);

    return res
      .status(201)
      .json({ message: "Revenus enregistrés avec succès." });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur." });
  }
}

module.exports = { getHistory, createRevenueEntry };
