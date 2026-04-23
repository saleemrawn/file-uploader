const folderRepository = require("../lib/repositories/folder.repository.js");
const fileRepository = require("../lib/repositories/file.repository.js");

async function getHomepage(req, res) {
  const files = await fileRepository.getAllFiles();
  res.render("index", { title: "Welcome", files: files.slice(0, 5) });
}

async function renderRecentFiles(req, res) {
  const files = await fileRepository.getAllFiles();
  res.render("recent", { title: "Recent", files: files });
}

module.exports = { getHomepage, renderRecentFiles };
