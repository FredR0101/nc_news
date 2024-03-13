const db = require("../db/connection");
const { arrayCommentData, retrieveUserNames } = require("../utilFunctions");
const users = require("../db/data/test-data/users");
const { selectTopicData } = require("./modelTopics");
const { retrieveAllUserData } = require("./modelUsers");

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
      articleData = article;
      return db.query(
        `SELECT COUNT(*) AS comment_count FROM comments WHERE article_id=$1`,
        [article_id]
      );
    })
    .then((commentResult) => {
      const commentCount = commentResult.rows[0].comment_count;
      articleData.comment_count = commentCount;
      return articleData;
    });
}

function retrieveAllArticleData(topic, sort_by = "created_at", order = "DESC") {
  const validOrders = ["ASC", "DESC"];
  const validSortBy = ["author", "created_at"];
  return selectTopicData()
    .then((result) => {
      return retrieveUserNames(result.rows, "slug");
    })
    .then((searchTopicsResult) => {
      const topicsArray = searchTopicsResult;
      const validTopics = topicsArray;
      if (topic && !validTopics.includes(topic)) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        if (order && !validOrders.includes(order)) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        if (sort_by && !validSortBy.includes(sort_by)) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        const queryVals = [];
        let sqlString = `SELECT 
                articles.author,
                articles.title,
                articles.article_id,
                articles.topic,
                articles.created_at,
                articles.votes,
                articles.article_img_url,
                COUNT(comments.comment_id) AS comment_count
                FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

        if (topic) {
          queryVals.push(topic);
          sqlString += ` WHERE topic=$1`;
        }

        sqlString += ` GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url  ORDER BY ${sort_by} ${order}`;
        return db.query(sqlString, queryVals).then((result) => {
          return result.rows;
        });
      }
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
    const formattedComment = arrayCommentData(newComment, "author", "body");
    const queryVals = [formattedComment[0], formattedComment[1]];
    let sqlString = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3)`;
    if (article_id) {
      queryVals.push(parseInt(article_id));
      sqlString += `RETURNING *;`;
      return db.query(sqlString, queryVals).then((result) => {
        return result.rows[0];
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
