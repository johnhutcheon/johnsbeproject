const {
  selectTopics,
  selectArticleById,
  incrementVotes,
  selectUsers,
  selectArticles,
} = require("../models/newsmodels.js");

exports.getTopics = (req, res) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => console.log(err));
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.updateVotes = (req, res, next) => {
  const { inc_votes } = req.body; //req.body.inc_votes
  const { article_id } = req.params;
  if (!inc_votes) {
    res.status(400).send({ msg: "Invalid Request" });
  }
  incrementVotes(inc_votes, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getUsers = (req, res) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => console.log(err));
};

exports.fetchArticles = (req, res) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => console.log(err));
};
