const folderRepository = require("../lib/repositories/folder.repository.js");

function renderCreateFolder(req, res) {
  res.render("createFolder", { title: "New Folder" });
}

async function renderManageFolders(req, res) {
  const folders = await folderRepository.getAllFolders();
  res.render("manageFolders", { title: "Manage Folders", folders: folders });
}

module.exports = { renderCreateFolder, renderManageFolders };
