const { request } = require("express");
const { Test } = require("supertest");
const {
  selectTopics,
  selectArticleById,
  incrementVotes,
  selectUsers,
  selectArticles,
  selectComments,
  postComment,
  selectQuery,
  removeComment,
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
    .then(([promise_one, promise_two]) => {
      res.status(200).send({ comments: promise_two });
    })
    .catch(next);
};

//////////////////////////

//// TICKET 10

exports.postedComment = (req, res, next) => {
  const id = req.params.article_id;
  const articleComment = req.body;
  postComment(articleComment, id)
    .then((postArticleComment) => {
      res.status(201).send(postArticleComment);
    })
    .catch((err) => next(err));
};

/// TICKET 11

exports.getQuery = (req, res, next) => {
  const { sort_by } = req.query;
  const { order_by } = req.query;
  const { topic } = req.query;
  selectQuery(sort_by, order_by, topic)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

/// TICKET 12

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

//// TICKET 13

exports.getApi = (req, res) => {
  res.status(200).send(endpoints);
};
