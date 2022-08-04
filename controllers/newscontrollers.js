const {
  selectTopics,
  selectArticleById,
  incrementVotes,
} = require("../models/newsmodels.js");

exports.getTopics = (req, res) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => console.log(err));
};

exports.getArticle = (req, res, next) => {
  console.log(req.params);
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.updateVotes = (req, res, next) => {
  console.log(req.body);
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  incrementVotes(inc_votes, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
