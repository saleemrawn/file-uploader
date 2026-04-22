const { Router } = require("express");
const folderRouter = Router();
const folderController = require("../controllers/folderController.cjs");
const fileController = require("../controllers/fileController.cjs");

folderRouter.get("/create", folderController.renderCreateFolder);
folderRouter.get("/manage", folderController.renderManageFolders);
folderRouter.get("/:folderId", fileController.getFilesByFolderId);
folderRouter.get("/edit/:folderId", folderController.renderEditFolder);

folderRouter.post("/create", folderController.folderValidators, folderController.createFolder);
folderRouter.post("/edit/:folderId", folderController.folderValidators, folderController.updateFolder);

module.exports = folderRouter;
