const jwt = require("jsonwebtoken");
const UserToken = require("../models/userToken");
const userToken = require("../models/userToken");

const generateTokens = async (user) => {
  try {
    const payload = { firstName: user.firstName, email: user.email };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: "140d" }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: "300d" }
    );

    return {
      refreshToken,
      accessToken,
    };
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = generateTokens;
