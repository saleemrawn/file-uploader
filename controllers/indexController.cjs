const fileRepository = require("../lib/repositories/file.repository.js");
const bytes = require("bytes");
const date = require("date-fns");

function renderHomepage(req, res) {
  const title = req.user ? "Dashboard" : "Simple & Easy File Uploader";
  const message = req.flash("info");

  res.render("index", { title, message, bytes, date });
}

async function renderRecentFiles(req, res, next) {
  try {
    const ownerId = Number(req.user.id);
    const files = await fileRepository.getAllFilesByOwnerId(ownerId);
    res.render("recent", { title: "Recent", files: files, bytes, date });
  } catch (err) {
    next(err);
  }
}

module.exports = { renderHomepage, renderRecentFiles };
