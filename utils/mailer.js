const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Formats a month and year like "janvier 2026"
 * @param {number} year
 * @param {number} month
 * @returns {string} ex: "janvier 2026"
 */
function formatMonthYear(year, month) {
  const date = new Date(year, month - 1);
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long" });
}

async function sendWelcomeEmail(to, salonName, managerName) {
  const mailOptions = {
    from: '"Beauty Stats" <noreply@beautystats.fr>',
    to,
    html: `
        <h2>Bienvenue ${managerName}</h2>
        <p>Votre salon <strong>${salonName}</strong> est désormais inscrit à Beauty Stats !</p>
        <p>Vous pouvez désormais vous connecter et commencer à remplir vos données.</p>
        <p style="color: #999;"> Ce mail est un test envoyé depuis Mailtrap</p>
        `,
  };

  return transporter.sendMail(mailOptions);
}

async function sendReminderEmail(email, salonName, managerName, year, month) {
  const fullMonthLabel = formatMonthYear(year, month);

  await transporter.sendMail({
    from: '"BeautyStats" <noreply@beautystats.fr>',
    to: email,
    subject: `Rappel: chiffre d'affaire manquant`,
    html: `
    <p>Bonjour ${managerName},</p>
    <p> Nous n'avons pas encore reçu le chiffre d'affaire de votre institut <strong>${salonName}</strong> pour le mois de <strong>${fullMonthLabel}</strong>.</p>
    <p>Merci de le saisir dès que possible dans votre espace personnel.</p>
    <p>- L'équipe BeautyStats</p>
    `,
  });
}

module.exports = { sendWelcomeEmail, sendReminderEmail };
