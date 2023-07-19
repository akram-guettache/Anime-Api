const sendEmail = require("./SendEmail");
const sendverificationemail = async ({
  name,
  email,
  userId,
  verificationToken,
  origin,
}) => {
  const emailverification = `${origin}/api/v1/auth/confirmation/${userId}/${verificationToken}`;
  const message = `<p>Please confirm your email by clicking on the following link : 
  <a href="${emailverification}">Verify Email</a> </p>`;
  return sendEmail({
    to: email,
    subject: "Email Verification",
    html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
  });
};
module.exports = sendverificationemail;
