const { body, validationResult, matchedData } = require("express-validator");
const userRepository = require("../lib/repositories/user.repository");
const bcrypt = require("bcryptjs");

const userValidators = [
  body("username").trim().notEmpty().withMessage("Username required").isAlphanumeric().withMessage("Username must only contain letters and numbers"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password required")
    .isStrongPassword()
    .withMessage("Password must be minimum 8 characters, with at least one lowercase letter, one uppercase letter, one number, one symbol"),
];

function getSignUp(req, res) {
  res.render("sign-up", { title: "Sign-Up" });
}

function getLogin(req, res) {
  res.render("login", { title: "Login" });
}

async function createUserAccount(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("sign-up", { title: "Sign-Up", errors: errors.array() });
  }

  const { username, password } = matchedData(req);
  const hashedPassword = await bcrypt.hash(password, 10);
  await userRepository.createUser(username, hashedPassword);

  res.redirect("/login");
}

function logoutUser(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });

  res.redirect("/");
}

module.exports = { getSignUp, getLogin, createUserAccount, logoutUser, userValidators };
