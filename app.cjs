const express = require("express");
const indexRouter = require("./routes/indexRouter.cjs");
const authRouter = require("./routes/authRouter.cjs");
const fileRouter = require("./routes/fileRouter.cjs");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
const folderRepository = require("./lib/repositories/folder.repository.js");
const fileRepository = require("./lib/repositories/file.repository.js");
const folderRouter = require("./routes/folderRouter.cjs");
const flash = require("connect-flash");
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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);
app.use(passport.session());
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (req.url.match(/\.html$/)) return res.set("Cache-Control", "no-cache");
  next();
});
app.use(
  express.static("public", {
    maxAge: "1y",
    immutable: true,
  }),
);
app.use(expressLayouts);
app.use(async (req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.urlPath = req.path;

  try {
    res.locals.folders = req.user ? await folderRepository.getAllFoldersByOwnerId(req.user.id) : [];
    res.locals.files = req.user ? await fileRepository.getAllFilesByOwnerId(req.user.id) : [];
  } catch (err) {
    return next(err);
  }

  next();
});
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/file", fileRouter);
app.use("/folder", folderRouter);
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = Number(err.statusCode) || err.status || 500;
  const message = err.message || "Oops, something went wrong";

  if (err.code === "ENOENT") {
    return res.status(statusCode).render("customError", {
      title: `${statusCode} | ${message}`,
      error: { statusCode, message: "No such file or directory" },
    });
  }

  res.status(statusCode).render("customError", {
    title: `${statusCode} | ${message}`,
    error: { statusCode, message },
  });
});

app.listen(port, (error) => {
  if (error) {
    throw error;
  }

  console.log(`App listening on port ${port}`);
});
