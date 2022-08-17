const db = require("../db/connection.js");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, 
    COUNT (comments.comment_id) 
    AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id`,
      [id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }
      return result.rows[0];
    });
};

exports.incrementVotes = (votes, id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id =$2 RETURNING *;`,
      [votes, id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }
      return result.rows[0];
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
};

exports.selectArticles = () => {
  return db.query("SELECT * FROM articles").then((result) => {
    return result.rows;
  });
};

exports.selectComments = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [id])
    .then((result) => {
      return result.rows;
    });
};

////////////////////////////////////

///TICKET 10

exports.postComment = (articleComment, id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [articleComment.username, articleComment.body, id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Page not found" });
      }
      return result.rows[0];
    });
};

///// TICKET 11

exports.selectQuery = (sortBy = `created_at`, orderBy = `DESC`, topic) => {
  const validSortBy = [
    "author",
    "title",
    "body",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrderBy = ["ASC", "DESC"];
  if (!validSortBy.includes(sortBy) || !validOrderBy.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  let queryStr =
    "SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ";
  if (topic) {
    queryStr += `WHERE articles.topic = $1 GROUP BY articles.article_id ORDER BY ${sortBy} ${orderBy};`; //attaching where statement to original query with group by and order by
    return db.query(queryStr, [topic]).then(({ rows }) => {
      const article = rows;
      return article;
    });
  } else {
    queryStr += `GROUP BY articles.article_id ORDER BY ${sortBy} ${orderBy};`;
    return db.query(queryStr).then(({ rows }) => {
      const article = rows;
      return article;
    });
  }
};

/// TICKET 12

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment_id not found",
        });
      }
    });
};
