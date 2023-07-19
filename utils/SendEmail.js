const createTransporter = require("./nodemailerconfig");
const sendEmail = async ({ to, subject, html }) => {
  const transporter = await createTransporter();
  return transporter.sendMail({
    from: '"Anime Api" <guettache.akram1@gmail.com>',
    to,
    subject,
    html,
  });
};
module.exports = sendEmail;
