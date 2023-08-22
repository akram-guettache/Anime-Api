const nodemailer = require("nodemailer");
const config = require("./nodemailerconfig");
const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(config);
  return transporter.sendMail({
    from: '"Anime Api" <guettache.akram1@gmail.com>',
    to,
    subject,
    html,
  });
};
module.exports = sendEmail;
