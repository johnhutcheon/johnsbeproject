const {
  selectTopics,
  selectArticleById,
  incrementVotes,
  selectUsers,
  selectArticles,
  selectComments,
} = require("../models/newsmodels.js");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
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

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.fetchArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([selectArticleById(article_id), selectComments(article_id)])
    .then(([article, comments]) => {
      console.log(article, comments);
      res.status(200).send({ comments });
    })

    .catch(next);
};
