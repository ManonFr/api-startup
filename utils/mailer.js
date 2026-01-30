const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendWelcomeEmail(to, salonName, managerName) {
  const mailOptions = {
    from: '"Beauty Stats" <noreply@beautystats.fr',
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

module.exports = { sendWelcomeEmail };
