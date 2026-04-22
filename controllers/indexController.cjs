const folderRepository = require("../lib/repositories/folder.repository.js");

async function getHomepage(req, res) {
  const folders = await folderRepository.getAllFolders();
  res.render("index", { title: "Upload File", folders: folders });
}

module.exports = { getHomepage };
