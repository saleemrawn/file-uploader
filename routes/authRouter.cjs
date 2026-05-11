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
      const errMessage = "Incorrect username or password";

      if (!user) {
        return done(null, false, { message: errMessage });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: errMessage });
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

authRouter.get("/sign-up", authController.renderSignUp);
authRouter.get("/login", authController.renderLogin);
authRouter.get("/logout", authController.logoutUser);
authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info, status) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("info", ["Incorrect username or password", "danger"]);
      return res.redirect("/login");
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      res.redirect("/");
    });
  })(req, res, next);
});

authRouter.post("/sign-up", authController.userValidators, authController.createUserAccount);

module.exports = authRouter;
