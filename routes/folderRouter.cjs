const { Router } = require("express");
const folderRouter = Router();
const fileController = require("../controllers/fileController.cjs");

folderRouter.get("/:folderId", fileController.getFilesByFolderId);

module.exports = folderRouter;
