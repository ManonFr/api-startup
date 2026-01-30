const db = require("../db/connection");

/**
 * Controller to get the authenticated user's profile
 * @param {import ("express").Request} req
 * @param {import ("express").Response} res
 */
async function getProfile(req, res) {
  const userId = req.user.id;

  try {
    const user = await db("users")
      .select(
        "id",
        "email",
        "salon_name",
        "salon_address",
        "opening_date",
        "full_time_employees_count",
        "manager_first_name",
        "manager_last_name",
      )
      .where({ id: userId })
      .first();

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.json({ profile: user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération du profil." });
  }
}

module.exports = { getProfile };
