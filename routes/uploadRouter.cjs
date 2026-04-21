const { Router } = require("express");
const uploadRouter = Router();
const uploadController = require("../controllers/uploadController.cjs");

uploadRouter.post("/upload", uploadController.uploadFile);

module.exports = uploadRouter;
