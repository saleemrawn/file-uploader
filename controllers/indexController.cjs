function getHomepage(req, res) {
  res.render("index", { title: "Upload File" });
}

module.exports = { getHomepage };
