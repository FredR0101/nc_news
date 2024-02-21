const { log } = require("console");
const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");

function retrieveArticleDataById(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return article;
    });
}

function retrieveAllArticleData(sort_by = "created_at", order = "DESC") {
  const validOrders = ["ASC", "DESC"];

  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  const validSortBy = ["author", "topic", "created_at"];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  let sqlString = `SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url`;

  sqlString += ` ORDER BY ${sort_by} ${order}`;

  return db.query(sqlString).then((result) => {
    return result.rows;
  });
}

function retrieveArticleComments(
  article_id,
  sort_by = "created_at",
  order = "DESC"
) {
  const validOrders = ["ASC", "DESC"];
  const queryVals = [];

  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  const validSortBy = ["author", "votes", "created_at"];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  let sqlString = `SELECT * FROM comments`;

  if (article_id) {
    sqlString += ` WHERE article_id=$1`;
    queryVals.push(parseInt(article_id));
  }

  sqlString += ` ORDER BY ${sort_by} ${order}`;


  return db.query(sqlString, queryVals).then((result) => {
        const comment = result.rows;
        if (comment.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Comments not found",
          });
        };
        return comment;
      });
  };


module.exports = {
  retrieveArticleDataById,
  retrieveAllArticleData,
  retrieveArticleComments,
};
