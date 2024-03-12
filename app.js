const express = require("express");
const cors = require('cors')
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
const {getAllUsers} = require("./controllers/controllerUsers")

app.use(cors())

app.use(express.json())

app.get("/api/topics", getTopicData);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleDataById);

app.get("/api/articles", getAllArticleData);

app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.get("/api/users", getAllUsers)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.post("/api/articles/:article_id/comments", postArticleCommentById);

app.patch("/api/articles/:article_id", patchArticleVotes)

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
