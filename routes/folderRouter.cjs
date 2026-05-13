const { Router } = require("express");
const folderRouter = Router();
const folderController = require("../controllers/folderController.cjs");

folderRouter.get("/create", folderController.renderCreateFolder);
folderRouter.get("/manage", folderController.renderManageFolders);
folderRouter.get("/:folderId", folderController.renderFolder);
folderRouter.get("/edit/:folderId", folderController.renderEditFolder);
folderRouter.get("/share/:folderId", folderController.renderShareFolderForm);
folderRouter.get("/shared/:shareUuid", folderController.renderSharedFolder);

folderRouter.post("/create", folderController.folderValidators, folderController.createFolder);
folderRouter.post("/share", folderController.shareFolder);
folderRouter.post("/edit/:folderId", folderController.folderValidators, folderController.updateFolder);
folderRouter.post("/delete/:folderId", folderController.deleteFolder);

module.exports = folderRouter;
