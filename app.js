const express = require("express");
const app = express();

const {
  getTopics,
  getArticle,
  updateVotes,
  getUsers,
  getComments,
  postedComment,
  getQuery,
  getApi,
  deleteComment,
} = require("./controllers/newscontrollers.js");

app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", updateVotes);
app.get("/api/users", getUsers);
//app.get("/api/articles", fetchArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postedComment);
app.get("/api/articles", getQuery);
app.get("/api", getApi);
app.delete("/api/comments/:comment_id", deleteComment);
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "23502" ||
    err.code === "42703" ||
    err.code === "42601" ||
    err.code === "42703" ||
    err.code === "23503"
  ) {
    res.status(400).send({ msg: "Invalid Request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

////////////////////////////////////

module.exports = app;
