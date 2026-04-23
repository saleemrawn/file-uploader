const folderRepository = require("../lib/repositories/folder.repository.js");
const fileRepository = require("../lib/repositories/file.repository.js");

async function getHomepage(req, res) {
  const folders = await folderRepository.getAllFolders();
  res.render("index", { title: "Upload File", folders: folders });
}

async function renderRecentFiles(req, res) {
  const files = await fileRepository.getAllFiles();
  res.render("recent", { title: "Recent", files: files });
}

module.exports = { getHomepage, renderRecentFiles };
