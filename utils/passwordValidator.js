function validatePassword(password) {
  if (password.lenght < 8) {
    return "Le mot de passe doit comporter au moins 8 caractères.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit comporter au moins une majuscule.";
  }

  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit comporter au moins un chiffre.";
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return "Le mot de passe doit comporter au moins un caractère spécial.";
  }
  return null;
}

module.exports = validatePassword;
