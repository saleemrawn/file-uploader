const { Router } = require("express");
const indexController = require("../controllers/indexController.cjs");
const indexRouter = Router();

indexRouter.get("/", indexController.getHomepage);

module.exports = indexRouter;
