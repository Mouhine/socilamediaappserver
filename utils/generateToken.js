const jwt = require("jsonwebtoken");
const UserToken = require("../models/userToken");
const userToken = require("../models/userToken");

const generateTokens = async (user) => {
  try {
    const payload = { firstName: user.firstName, email: user.email };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: "14d" }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: "30d" }
    );

    const userToken = await UserToken.findOne({ firstName: user.firstName });
    if (userToken) await userToken.remove();

    await new UserToken({
      firstName: user.firstName,
      token: refreshToken,
    }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = generateTokens;
