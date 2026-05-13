const folderRepository = require("../lib/repositories/folder.repository.js");
const bytes = require("bytes");
const date = require("date-fns");
const { v4: uuidv4 } = require("uuid");

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

    res.render("folder", { title: folder.name, folder: folder, message: req.flash("info"), bytes, date });
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

function renderManageFolders(req, res) {
  res.render("manageFolders", { title: "Manage Folders", message: req.flash("info") });
}

async function renderShareFolderForm(req, res, next) {
  const folderId = Number(req.params.folderId);
  const folder = await folderRepository.getFolderById(folderId);
  const shareUrl = req.query.shareUrl;

  if (!folder) {
    const err = new Error("Folder not found");
    err.statusCode = 404;
    return next(err);
  }

  res.render("shareFolder", { title: "Share Folder", message: req.flash("info"), shareUrl, folder });
}

async function renderSharedFolder(req, res, next) {
  try {
    const uuid = req.params.shareUuid;
    const shareData = await folderRepository.getFolderByUuid(uuid);

    if (!shareData) {
      const err = new Error("Shared link is broken or does not exist");
      err.statusCode = 404;
      return next(err);
    }

    if (!shareData.folder) {
      const err = new Error("Shared folder not found");
      err.statusCode = 404;
      return next(err);
    }

    if (shareData.expiresAt < new Date()) {
      const err = new Error("Shared link has expired");
      err.statusCode = 410;
      return next(err);
    }

    res.render("folder", {
      title: shareData.folder.name,
      folder: shareData.folder,
      message: req.flash("info"),
      bytes,
      date,
    });
  } catch (err) {
    next(err);
  }
}

async function shareFolder(req, res, next) {
  try {
    const uuid = uuidv4();
    const shareUrl = `${req.protocol}://${req.get("host")}/folder/shared/${uuid}`;

    await folderRepository.createFolderShareLink({
      uuid,
      folderId: Number(req.body.folderId),
      ownerId: Number(req.body.ownerId),
      expiryDuration: Number(req.body.expiryDuration),
    });

    req.flash("info", ["Share link generated successfully", "success"]);

    req.session.save((err) => {
      if (err) return next(err);
      res.redirect(`/folder/share/${req.body.folderId}?shareUrl=${encodeURIComponent(shareUrl)}`);
    });
  } catch (err) {
    next(err);
  }
}

async function createFolder(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("folderForm", { title: "Create Folder", folder: {}, errors: errors.array() });
    }

    const { name } = matchedData(req);
    await folderRepository.createFolder({ name: name, ownerId: Number(req.body.ownerId) });

    req.flash("info", ["Folder created successfully!", "success"]);

    req.session.save((err) => {
      if (err) return next(err);
      res.redirect("/folder/manage");
    });
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

    req.flash("info", ["Folder updated successfully!", "success"]);
    req.session.save((err) => {
      if (err) return next(err);
      res.redirect("/folder/manage");
    });
  } catch (err) {
    next(err);
  }
}

async function deleteFolder(req, res, next) {
  try {
    const folderId = Number(req.params.folderId);
    await folderRepository.deleteFolder(folderId);

    req.flash("info", ["Folder deleted successfully!", "success"]);

    req.session.save((err) => {
      if (err) return next(err);
      res.redirect("/folder/manage");
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  renderFolder,
  renderCreateFolder,
  renderEditFolder,
  renderManageFolders,
  renderShareFolderForm,
  renderSharedFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  shareFolder,
  folderValidators,
};
