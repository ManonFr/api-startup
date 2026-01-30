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

/**
 * Controller to update the authenticated user's profile
 * @param {import("express").Request} req
 * @param {import ("express").Response} res
 */
async function updateProfile(req, res) {
  const userId = req.user.id;
  const {
    salon_name,
    salon_address,
    opening_date,
    full_time_employees_count,
    manager_first_name,
    manager_last_name,
  } = req.body;

  try {
    await db("users").where({ id: userId }).update({
      salon_name,
      salon_address,
      opening_date,
      full_time_employees_count,
      manager_first_name,
      manager_last_name,
      updated_at: db.fn.now(),
    });

    res.json({ message: "Profil modifié avec succès." });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la modification du profil." });
  }
}

module.exports = { getProfile, updateProfile };
