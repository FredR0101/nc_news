const express = require("express");
const app = express();
const {
  getTopicData,
  getError,
  getEndpoints,
} = require("./controllers/controllerTopics");
const {
  getArticleDataById,
  getAllArticleData,
  getArticleCommentsById,
  postArticleCommentById,
  patchArticleVotes
} = require("./controllers/controllerArticles");
const {deleteCommentById} = require("./controllers/controllerComments")

app.use(express.json())

app.get("/api/topics", getTopicData);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleDataById);

app.get("/api/articles", getAllArticleData);

app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.delete("/api/comments/:comment_id", deleteCommentById)

app.post("/api/articles/:article_id/comments", postArticleCommentById);

app.put("/api/articles/:article_id", patchArticleVotes)

app.all("/api/*", getError);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
