const path = require("node:path");
const multer = require("multer");
const fileRepository = require("../lib/repositories/file.repository.js");
const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 /* 5MB */, files: 1 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx", ".xml"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
      return cb(new Error("Invalid file type or extension"));
    }

    cb(null, true);
  },
});

async function uploadFile(req, res, next) {
  upload.single("file")(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) return handleMulterError(err, res);
      if (err) return renderFormError(res, err.message);
      if (!req.file) return renderFormError(res, "File is required");
      if (isNaN(Number(req.body.folder))) return renderFormError(res, "Folder is required");

      const bucketName = getBucketName(req.file.mimetype);
      const filename = `public/${uuidv4()}-${req.file.originalname}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filename, req.file.buffer, { contentType: req.file.mimetype });

      if (error) return next(error);

      await fileRepository.createFile({
        name: req.file.originalname,
        mimetype: req.file.mimetype,
        path: data.path,
        bucket: bucketName,
        size: req.file.size,
        ownerId: Number(req.body.ownerId),
        folderId: Number(req.body.folder),
      });

      req.flash("info", ["Upload successful", "success"]);
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  });
}

function getBucketName(mimetype) {
  if (mimetype.startsWith("image/")) return "Images";
  return "Documents";
}

function handleMulterError(err, res) {
  const messages = {
    LIMIT_FILE_SIZE: "File exceeds 5MB limit",
    LIMIT_FILE_COUNT: "Upload one file at a time",
  };

  return renderFormError(res, messages[err.code] ?? err.message);
}

function renderFormError(res, msg) {
  return res.status(400).render("fileForm", { title: "Upload file", file: {}, errors: [{ msg }] });
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
  const folderId = req.query.folderId ? Number(req.query.folderId) : null;
  res.render("fileForm", { title: "Upload File", file: {}, folderId: folderId });
}

async function renderEditFile(req, res, next) {
  try {
    const fileId = Number(req.params.fileId);
    const file = await fileRepository.getFileById(fileId);

    if (!file) {
      const err = new Error("File not found");
      err.statusCode = 404;
      return next(err);
    }

    res.render("fileForm", { title: "Edit File", file: file });
  } catch (err) {
    next(err);
  }
}

async function updateFileFolder(req, res, next) {
  try {
    const fileId = Number(req.body.fileId);
    const folderId = Number(req.body.folder);
    const ownerId = Number(req.body.ownerId);

    await fileRepository.updateFileFolderById({ fileId: fileId, folderId: folderId, ownerId: ownerId });
    req.flash("info", ["File updated successfully!", "success"]);
    req.session.save((err) => {
      res.redirect(`/folder/${folderId}`);
    });
  } catch (err) {
    next(err);
  }
}

async function deleteFile(req, res, next) {
  try {
    const fileId = Number(req.params.fileId);
    const file = await fileRepository.getFileById(fileId);

    const { error } = await supabase.storage.from(file.bucket).remove([`${file.path}`]);
    if (error) return next(error);

    await fileRepository.deleteFileById(fileId);

    const path = req.body.folderId ? `/folder/${req.body.folderId}` : "/";

    req.flash("info", ["File deleted successfully!", "success"]);
    req.session.save((err) => {
      if (err) return next(err);
      res.redirect(path);
    });
  } catch (err) {
    next(err);
  }
}

async function downloadFile(req, res, next) {
  const fileId = Number(req.params.fileId);
  const file = await fileRepository.getFileById(fileId);

  const { data, error } = await supabase.storage.from(`/public/${file.bucket}`).download(file.path);
  if (error) return next(error);

  const buffer = Buffer.from(await data.arrayBuffer());

  res.setHeader("Content-Type", file.mimetype);
  res.setHeader("Content-Length", buffer.length);
  res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);

  res.send(buffer);
}

module.exports = {
  uploadFile,
  getFilesByFolderId,
  renderUploadFile,
  renderEditFile,
  updateFileFolder,
  deleteFile,
  downloadFile,
};
