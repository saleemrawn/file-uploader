const { body, validationResult, matchedData } = require("express-validator");
const userRepository = require("../lib/repositories/user.repository");
const bcrypt = require("bcryptjs");

const userValidators = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username required")
    .isAlphanumeric()
    .withMessage("Username must only contain letters and numbers"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password required")
    .isStrongPassword()
    .withMessage(
      "Password must be minimum 8 characters, with at least one lowercase letter, one uppercase letter, one number, one symbol",
    ),
];

function renderSignUp(req, res) {
  res.render("sign-up", { title: "Sign-Up", message: req.flash("info") });
}

function renderLogin(req, res) {
  res.render("login", { title: "Login", message: req.flash("info") });
}

async function createUserAccount(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", { title: "Sign-Up", errors: errors.array() });
    }

    const { username, password } = matchedData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.createUser(username, hashedPassword);

    req.flash("info", ["Account created successfully!", "success"]);
    res.redirect("/login");
  } catch (err) {
    next(err);
  }
}

function logoutUser(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  });
}

module.exports = { renderSignUp, renderLogin, createUserAccount, logoutUser, userValidators };
