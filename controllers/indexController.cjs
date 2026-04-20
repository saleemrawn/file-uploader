function getHomepage(req, res) {
  res.render("index", { title: "Upload File", currentUser: req.user?.username });
}

module.exports = { getHomepage };
