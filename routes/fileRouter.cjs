const { Router } = require("express");
const fileRouter = Router();
const fileController = require("../controllers/fileController.cjs");

fileRouter.post("/upload", fileController.uploadFile);

module.exports = fileRouter;
