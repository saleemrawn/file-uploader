const { Router } = require("express");
const uploadRouter = Router();
const fileController = require("../controllers/fileController.cjs");

uploadRouter.post("/upload", fileController.uploadFile);

module.exports = uploadRouter;
