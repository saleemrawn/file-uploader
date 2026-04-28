const { Router } = require("express");
const indexController = require("../controllers/indexController.cjs");
const indexRouter = Router();

indexRouter.get("/", indexController.renderHomepage);
indexRouter.get("/recent", indexController.renderRecentFiles);

module.exports = indexRouter;
