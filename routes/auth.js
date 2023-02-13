const express = require("express");
const { register, login, googleAuth } = require("../controllers/auth");
const { handleRefreshToken } = require("../controllers/handelRefreshTokens");
const { handleLogout } = require("../controllers/LogouControllers");
const authRouter = express.Router();

authRouter.post("/signUp", register);
authRouter.post("/login", login);
authRouter.post("/google", googleAuth);
authRouter.get("/logout", handleLogout);
authRouter.get("/refresh", handleRefreshToken);

module.exports = authRouter;
