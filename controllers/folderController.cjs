const folderRepository = require("../lib/repositories/folder.repository.js");

async function renderManageFolders(req, res) {
  const folders = await folderRepository.getAllFolders();
  res.render("manageFolders", { title: "Manage Folders", folders: folders });
}

module.exports = { renderManageFolders };
