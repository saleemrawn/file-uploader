const { Router } = require("express");
const fileRouter = Router();
const fileController = require("../controllers/fileController.cjs");

fileRouter.get("/upload", fileController.renderUploadFile);
fileRouter.post("/upload", fileController.uploadFile);

module.exports = fileRouter;
