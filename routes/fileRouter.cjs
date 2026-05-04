const { Router } = require("express");
const fileRouter = Router();
const fileController = require("../controllers/fileController.cjs");

fileRouter.get("/upload", fileController.renderUploadFile);
fileRouter.get("/edit/:fileId", fileController.renderEditFile);
fileRouter.get("/download/:fileId", fileController.downloadFile);

fileRouter.post("/upload", fileController.uploadFile);
fileRouter.post("/edit/:fileId", fileController.updateFileFolder);
fileRouter.post("/delete/:fileId", fileController.deleteFile);

module.exports = fileRouter;
