const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });
const fileRepository = require("../lib/repositories/file.repository.js");

function uploadFile(req, res, next) {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    try {
      await fileRepository.createFile({
        name: req.file.originalname,
        mimetype: req.file.mimetype,
        path: req.file.path,
        size: req.file.size,
        ownerId: Number(req.body.ownerId),
        folderId: Number(req.body.folder),
      });

      res.redirect("/");
    } catch (err) {
      next(err);
    }
  });
}

async function getFilesByFolderId(req, res) {
  const folderId = Number(req.params.folderId);
  const files = await fileRepository.getFilesByFolderId(folderId);

  if (!files || files.length === 0) {
    const error = { statusCode: 404, message: "Folder not found" };
    return res.status(404).render("customError", { title: `${error.statusCode} | ${error.message}`, error: error });
  }

  const title = files[0]?.folder.name;
  res.render("folder", { title: title, files: files });
}

function renderUploadFile(req, res) {
  res.render("upload", { title: "Upload file" });
}

module.exports = { uploadFile, getFilesByFolderId, renderUploadFile };
