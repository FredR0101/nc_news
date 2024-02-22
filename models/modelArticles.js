const db = require("../db/connection");
const { arrayCommentData, retrieveUserNames } = require("../utilFunctions");
const users = require("../db/data/test-data/users");

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
  const queryVals = [];

  let sqlString = `SELECT * FROM comments`;

  if (article_id) {
    sqlString += ` WHERE article_id=$1`;
    queryVals.push(parseInt(article_id));
  }

  sqlString += ` ORDER BY ${sort_by} ${order}`;

  return db.query(sqlString, queryVals).then((result) => {
    const comment = result.rows;
    return comment;
  });
}

function insertComment(article_id, newComment) {
  if (Object.keys(newComment).length !== 2) {
    return Promise.reject({
      status: 400,
      msg: "Invalid data input",
    });
  } else {
    const usernames = retrieveUserNames(users, "username");
    const formattedComment = arrayCommentData(newComment, "author", "body");
    if (usernames.includes(formattedComment[0])) {
      const queryVals = [formattedComment[0], formattedComment[1]];
      let sqlString = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3)`;
      if (article_id) {
        queryVals.push(parseInt(article_id));
        sqlString += `RETURNING *;`;
        return db.query(sqlString, queryVals).then((result) => {
          return result.rows[0];
        });
      }
    } else {
      return Promise.reject({
        status: 401,
        msg: "Invalid user",
      });
    }
  }
}

function updateVotes(article_id, newVotes) {
  if (typeof newVotes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "votes must be a number",
    });
  } else {
    return retrieveArticleDataById(article_id).then((result) => {
      const updatedVotes = (result.votes += newVotes);
      if (updatedVotes < 0) {
        return Promise.reject({
          status: 400,
          msg: "Votes cannot go below 0",
        });
      } else {
        return db
          .query(
            `UPDATE articles SET votes=$1 WHERE article_id=$2 RETURNING *`,
            [updatedVotes, article_id]
          )
          .then((updatedResult) => {
            return updatedResult.rows[0];
          });
      }
    });
  }
}

module.exports = {
  retrieveArticleDataById,
  retrieveAllArticleData,
  retrieveArticleComments,
  insertComment,
  updateVotes,
};
