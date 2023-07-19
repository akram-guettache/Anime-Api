const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    minlength: 3,
    maxlength: 25,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter A Password"],
  },
  favourites: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Anime",
  },
  verificationToken: String,
  verified: {
    type: Boolean,
    default: false,
  },
  passwordToken: String,
  PTexpirationDate: Date,
  role: {
    type: String,
    default: "user",
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createToken = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

UserSchema.methods.comparePW = async function (pw) {
  const isValid = await bcrypt.compare(pw, this.password);
  return isValid;
};
module.exports = mongoose.model("User", UserSchema);
