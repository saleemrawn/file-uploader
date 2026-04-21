const express = require("express");
const indexRouter = require("./routes/indexRouter.cjs");
const authRouter = require("./routes/authRouter.cjs");
const uploadRouter = require("./routes/uploadRouter.cjs");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("./lib/prisma.js");
const app = express();
const port = 8080;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", uploadRouter);

app.listen(port, (error) => {
  if (error) {
    throw error;
  }

  console.log(`App listening on port ${port}`);
});
