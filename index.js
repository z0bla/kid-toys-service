const express = require("express");
const app = express();
const port = "5000";

app.get("/*", (req, res) => {
  res.end("Uspjelo!");
});

app.listen(port, () => {
  "Server is listening...";
});
