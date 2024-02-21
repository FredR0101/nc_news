const express = require("express");
const app = express();
const {
  getTopicData,
  getError,
  getEndpoints,
} = require("./controllers/controllerTopics");
const { getArticleDataById, getAllArticleData, getArticleCommentsById } = require("./controllers/controllerArticles");

app.get("/api/topics", getTopicData);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleDataById);

app.get("/api/articles", getAllArticleData)

app.get("/api/articles/:article_id/comments", getArticleCommentsById)

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
