const express = require("express");
const app = express();

const { getTopics, getArticle } = require("./controllers/newscontrollers.js");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  console.log(err);
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

module.exports = app;
