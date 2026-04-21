const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });
const uploadRepository = require("../lib/repositories/upload.repository.js");

function uploadFile(req, res, next) {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    try {
      await uploadRepository.createFile({
        name: req.file.originalname,
        mimetype: req.file.mimetype,
        path: req.file.path,
        size: req.file.size,
        ownerId: Number(req.body.ownerId),
        folderId: null,
      });

      res.redirect("/");
    } catch (err) {
      next(err);
    }
  });
}

module.exports = { uploadFile };
