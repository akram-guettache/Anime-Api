const User = require("../models/User");
const sendverificationemail = require("../utils/SendVerificationMail");
const sendresetemail = require("../utils/ResetPassword");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new BadRequestError("Email already exists");
  }
  const verificationToken = crypto.randomBytes(30).toString("hex");
  const user = await User.create({
    name,
    email,
    password,
    verificationToken: verificationToken,
  });

  const origin = "https://anime-api-aiup.onrender.com";
  await sendverificationemail({
    name: user.name,
    email: user.email,
    userId: user._id,
    verificationToken: verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Account Created Successfully!,Please Check Your Email To Verify Your  Account.Note That The Email May Appear In The Spam Section Of Your Email  ",
  });
};
const verifyAccount = async (req, res) => {
  const { userId, verificationToken } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`No User Found With The Following ID: ${userId}`);
  }
  if (verificationToken !== user.verificationToken) {
    throw new BadRequestError("Verification Failed");
  }
  user.verified = true;
  user.verificationToken = "";
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Congrats! Your Account Is Successfully Verified" });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please Enter Your Email And Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("Please Register if New or Verify Your Email");
  }
  const CPW = await user.comparePW(password);
  if (!CPW) {
    throw new BadRequestError("Please Verify Your Password");
  }
  if (!user.verified) {
    throw new BadRequestError(
      "Please Verify Your Account By Going To your Email Adress And Click The Given Link"
    );
  }
  const token = user.createToken();
  res.cookie("jwt", token, {
    expiresIn: process.env.JWT_EXPIRE,
    httpOnly: true,
    secure: true,
  });
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, email: user.email } });
};
const ForgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError(`No User Found With The Following Email: ${email}`);
  }
  const passwordToken = crypto.randomBytes(48).toString("hex");
  const origin = "https://anime-api-aiup.onrender.com/";
  const fifteenminutes = 1000 * 60 * 15;
  await sendresetemail({
    name: user.name,
    email: user.email,
    userId: user._id,
    passwordToken: passwordToken,
    origin,
  });
  const PTexpirationDate = new Date(Date.now() + fifteenminutes);
  user.passwordToken = passwordToken;
  user.PTexpirationDate = PTexpirationDate;
  await user.save();
  res.status(StatusCodes.OK).json({
    msg: "Please Check Your Email To Reset Your Password By Clicking The Given Link ",
  });
};
const ResetPassword = async (req, res) => {
  const { userId, passwordToken } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`No User Found With The Following ID! ${userId}`);
  }
  if (passwordToken !== user.passwordToken) {
    throw new BadRequestError("Password Token Not Valid, Please Try Again");
  }
  const currentDate = new Date();
  if (user.PTexpirationDate < currentDate) {
    throw new BadRequestError(
      "Password Token Expired, Please Make Another Request"
    );
  }
  const { password } = req.body;
  user.password = password;
  user.passwordToken = null;
  user.PTexpirationDate = null;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "You Changed Your Password Successfully" });
};
const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(StatusCodes.OK).json("Logged Out Successfully");
  res.redirect("/");
};

module.exports = {
  register,
  login,
  logout,
  verifyAccount,
  ForgotPassword,
  ResetPassword,
};
