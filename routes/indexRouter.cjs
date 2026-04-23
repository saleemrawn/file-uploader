const { Router } = require("express");
const indexController = require("../controllers/indexController.cjs");
const indexRouter = Router();

indexRouter.get("/", indexController.getHomepage);
indexRouter.get("/recent", indexController.renderRecentFiles);

module.exports = indexRouter;
