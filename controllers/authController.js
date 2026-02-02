const bcrypt = require("bcryptjs");
const db = require("../db/connection");
const jwt = require("jsonwebtoken");
const validatePassword = require("../utils/passwordValidator");
const { sendWelcomeEmail } = require("../utils/mailer");

// POST /register
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
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
    department_id,
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
    !manager_last_name ||
    !department_id
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
      department_id,
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

// Post /login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Veuillez insérer votre email et votre mot de passe." });
  }

  try {
    const user = await db("users").where({ email }).first();

    if (!user) {
      return res
        .status(401)
        .json({ error: "Email ou mot de passe incorrect." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ error: "Email ou mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur." });
  }
}

module.exports = {
  register,
  login,
};
