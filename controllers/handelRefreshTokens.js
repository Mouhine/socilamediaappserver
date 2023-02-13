const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(req.cookies);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_PRIVATE_KEY,
    (err, decoded) => {
      if (err || foundUser.firstName !== decoded.firstName)
        return res.sendStatus(403);
      // const roles = Object.values(foundUser.roles);
      const payload = {
        firstName: foundUser.firstName,
        email: foundUser.email,
      };
      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "10s" }
      );
      res.json({ accessToken, userId: foundUser._id });
    }
  );
};

module.exports = { handleRefreshToken };
