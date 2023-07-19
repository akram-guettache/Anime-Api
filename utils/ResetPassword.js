const sendEmail = require("./SendEmail");
const sendresetemail = async ({
  name,
  email,
  userId,
  passwordToken,
  origin,
}) => {
  const emailverification = `${origin}/api/v1/auth/reset-password/${userId}/${passwordToken}`;
  const message = `<p>Please Reset Your Password by clicking on the following link : 
  <a href="${emailverification}">Verify Email</a> </p>`;
  return sendEmail({
    to: email,
    subject: "Password Reset",
    html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
  });
};
module.exports = sendresetemail;
