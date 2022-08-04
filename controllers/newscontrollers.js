const {
  selectTopics,
  selectArticleById,
  incrementVotes,
<<<<<<< HEAD
  selectUsers,
=======
>>>>>>> main
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
<<<<<<< HEAD
  const { inc_votes } = req.body; //req.body.inc_votes
  const { article_id } = req.params;
  if (!inc_votes) {
    res.status(400).send({ msg: "Invalid Request" });
  }
=======
  const { inc_votes } = req.body;
  const { article_id } = req.params;
>>>>>>> main
  incrementVotes(inc_votes, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
<<<<<<< HEAD

exports.getUsers = (req, res) => {
  console.log("gets here");
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => console.log(err));
};
=======
>>>>>>> main
