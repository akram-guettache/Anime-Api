const express = require("express");
const {
  register,
  login,
  logout,
  verifyAccount,
  ForgotPassword,
  ResetPassword,
} = require("../controllers/auth");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/confirmation/:userId/:verificationToken").get(verifyAccount);
router.route("/forgot-password").post(ForgotPassword);
router.route("/reset-password/:userId/:passwordToken").post(ResetPassword);
module.exports = router;
