const User = require("../models/User");
const {
  signUpBodyValidation,
  logInBodyValidation,
} = require("../utils/validationSchema");
const bcrypt = require("bcrypt");
const generateTokens = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);
const register = async (req, res, next) => {
  try {
    const { error } = signUpBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .json({ error: true, message: "User with given email already exist" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const { refreshToken, accessToken } = await generateTokens(req.body);

    const newUser = await new User({
      ...req.body,
      password: hashPassword,
      refreshToken: refreshToken,
    }).save();

    res.cookie("jwt", refreshToken, {
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      error: false,
      message: "Account created sucessfully",
      accessToken: accessToken,
      userId: newUser._id,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};
const login = async (req, res) => {
  try {
    const { error } = logInBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!verifiedPassword)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });

    const { accessToken, refreshToken } = await generateTokens(user);
    res.cookie("jwt", refreshToken, {
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      error: false,
      accessToken,
      message: "Logged in sucessfully",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};
const googleAuth = async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

  res.json(tokens);
};
const forgetpassword = async () => {};
const resetpassword = async () => {};

const Logout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = {
  register,
  login,
  googleAuth,
  Logout,
};
