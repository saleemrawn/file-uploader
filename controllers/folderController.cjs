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

async function renderFolder(req, res, next) {
  try {
    const folderId = Number(req.params.folderId);
    const folder = await folderRepository.getFolderById(folderId);

    if (!folder) {
      const err = new Error("Folder not found");
      err.statusCode = 404;
      return next(err);
    }

    res.render("folder", { title: folder.name, folder: folder });
  } catch (err) {
    next(err);
  }
}

function renderCreateFolder(req, res) {
  res.render("folderForm", { title: "Create Folder", folder: {} });
}

async function renderEditFolder(req, res, next) {
  try {
    const folderId = Number(req.params.folderId);
    const folder = await folderRepository.getFolderById(folderId);

    if (!folder) {
      const err = new Error("Folder not found");
      err.statusCode = 404;
      return next(err);
    }

    res.render("folderForm", { title: "Edit Folder", folder: folder });
  } catch (err) {
    next(err);
  }
}

async function renderManageFolders(req, res) {
  res.render("manageFolders", { title: "Manage Folders" });
}

async function createFolder(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("folderForm", { title: "Create Folder", folder: {}, errors: errors.array() });
    }

    const { name } = matchedData(req);
    await folderRepository.createFolder({ name: name, ownerId: Number(req.body.ownerId) });

    res.redirect("/folder/manage");
  } catch (err) {
    next(err);
  }
}

async function updateFolder(req, res, next) {
  try {
    const folderId = Number(req.params.folderId);
    const folder = await folderRepository.getFolderById(folderId);
    const errors = validationResult(req);

    if (!folder) {
      const err = new Error("Folder not found");
      err.statusCode = 404;
      return next(err);
    }

    if (!errors.isEmpty()) {
      return res.status(400).render("folderForm", { title: "Edit Folder", folder: folder, errors: errors.array() });
    }

    const { name } = matchedData(req);
    await folderRepository.updateFolder({ name: name, folderId: Number(req.params.folderId) });
    res.redirect("/folder/manage");
  } catch (err) {
    next(err);
  }
}

async function deleteFolder(req, res, next) {
  try {
    const folderId = Number(req.params.folderId);
    await folderRepository.deleteFolder(folderId);
    res.redirect("/folder/manage");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  renderFolder,
  renderCreateFolder,
  renderEditFolder,
  renderManageFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  folderValidators,
};
