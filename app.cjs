const express = require("express");
const app = express();
const port = 8080;

app.listen(port, (error) => {
  if (error) {
    throw error;
  }

  console.log(`App listening on port ${port}`);
});
