/**
 * Validate profile update data
 * @param {object} data - The request body
 * @returns {object|null} - An object with an error message if invalid, or null if valid
 */
function validateProfileUpdate(data) {
  const { opening_date, full_time_employees_count } = data;

  // Validate opening_date is a valid date string
  if (!opening_date || isNaN(Date.parse(opening_date))) {
    return {
      error:
        "La date d'ouverture doit être une date valide au format YYY-MM-DD",
    };
  }

  // Validate full_time_employees_count is a non-negative integer
  if (
    typeof full_time_employees_count !== "number" ||
    full_time_employees_count < 0 ||
    !Number.isInteger(full_time_employees_count)
  ) {
    return {
      error: "Le nombre d'employés à temps plein ne doit pas être négatif.",
    };
  }

  return null;
}

module.exports = { validateProfileUpdate };
