const express = require("express");
const indexRouter = require("./routes/indexRouter.cjs");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 8080;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.use("/", indexRouter);

app.listen(port, (error) => {
  if (error) {
    throw error;
  }

  console.log(`App listening on port ${port}`);
});
