const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const authenticate = async (req, res, next) => {
  const authCookie = req.cookies.jwt;
  if (!authCookie) {
    throw new UnauthenticatedError("Unauthenticated");
  }
  const token = authCookie;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    };
    next();
  } catch (error) {
    console.log(error);
  }
};
module.exports = authenticate;
