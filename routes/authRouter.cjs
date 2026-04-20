const { Router } = require("express");
const authController = require("../controllers/authController.cjs");
const authRouter = Router();

authRouter.get("/sign-up", authController.getSignUp);
authRouter.post("/sign-up", authController.userValidators, authController.createUserAccount);

module.exports = authRouter;
