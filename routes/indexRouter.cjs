const { Router } = require("express");
const indexControllers = require("../controllers/indexControllers.cjs");
const indexRouter = Router();

indexRouter.get("/", indexControllers.getHomepage);

module.exports = indexRouter;
