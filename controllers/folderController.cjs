const folderRepository = require("../lib/repositories/folder.repository.js");
const { body, validationResult, matchedData } = require("express-validator");

const folderValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Folder name is required")
    .isAlphanumeric(undefined, { ignore: " " })
    .withMessage("Folder name must contain letters and numbers only"),
];

function renderCreateFolder(req, res) {
  res.render("folderForm", { title: "New Folder", folder: {} });
}

async function renderEditFolder(req, res) {
  const folderId = Number(req.params.folderId);
  const folder = await folderRepository.getFolderById(folderId);

  res.render("folderForm", { title: "Edit Folder", folder: folder });
}

async function renderManageFolders(req, res) {
  const folders = await folderRepository.getAllFolders();
  res.render("manageFolders", { title: "Manage Folders", folders: folders });
}

async function createFolder(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("createFolder", { title: "New Folder", errors: errors.array() });
  }

  const { name } = matchedData(req);
  await folderRepository.createFolder({ name: name, ownerId: Number(req.body.ownerId) });
  res.redirect("/folder/manage");
}

async function updateFolder(req, res) {
  const folderId = Number(req.params.folderId);
  const folder = await folderRepository.getFolderById(folderId);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("folderForm", { title: "Edit Folder", folder: folder, errors: errors.array() });
  }

  const { name } = matchedData(req);
  await folderRepository.updateFolder({ name: name, folderId: Number(req.params.folderId) });
  res.redirect("/folder/manage");
}

async function deleteFolder(req, res) {
  const folderId = Number(req.params.folderId);
  await folderRepository.deleteFolder(folderId);
  res.redirect("/folder/manage");
}

module.exports = { renderCreateFolder, renderEditFolder, renderManageFolders, createFolder, updateFolder, deleteFolder, folderValidators };
