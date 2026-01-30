const bcrypt = require("bcryptjs");
const db = require("../db/connection");
const validatePassword = require("../utils/passwordValidator");
const { sendWelcomeEmail } = require("../utils/mailer");

// POST /register
async function register(req, res) {
  const {
    email,
    password,
    salon_name,
    salon_address,
    opening_date,
    full_time_employees_count,
    manager_first_name,
    manager_last_name,
  } = req.body;

  // Check required fields
  if (
    !email ||
    !password ||
    !salon_name ||
    !salon_address ||
    !opening_date ||
    !full_time_employees_count ||
    !manager_first_name ||
    !manager_last_name
  ) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires." });
  }

  // Validate password
  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: "Erreur de connexion." });
  }

  try {
    // Check if user already exists
    const existingUser = await db("users").where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ error: "Cet email est déjà utilisé." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    await db("users").insert({
      email,
      password: hashedPassword,
      salon_name,
      salon_address,
      opening_date,
      full_time_employees_count,
      manager_first_name,
      manager_last_name,
    });

    // Send welcome email
    await sendWelcomeEmail(
      email,
      salon_name,
      `${manager_first_name} ${manager_last_name}`,
    );

    res.status(201).json({ message: "Utilisateur enregistré avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur de serveur interne." });
  }
}

module.exports = {
  register,
};
