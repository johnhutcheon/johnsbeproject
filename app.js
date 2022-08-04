const express = require("express");
const app = express();

const {
  getTopics,
  getArticle,
  updateVotes,
} = require("./controllers/newscontrollers.js");

app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", updateVotes);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

module.exports = app;
