const { Router } = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const userRepository = require("../lib/repositories/user.repository.js");
const authController = require("../controllers/authController.cjs");
const authRouter = Router();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userRepository.findUserByUsername(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepository.findUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

authRouter.get("/sign-up", authController.getSignUp);
authRouter.get("/login", authController.getLogin);
authRouter.get("/logout", authController.logoutUser);
authRouter.post("/login", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login" }));
authRouter.post("/sign-up", authController.userValidators, authController.createUserAccount);

module.exports = authRouter;
