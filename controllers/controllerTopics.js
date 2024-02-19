const { selectTopicData, createError } = require("../models/modelTopics");
const endpoints = require("../endpoints.json");

function getTopicData(req, res, next) {
  selectTopicData()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
}

function getError(req, res, next) {
  const error = createError();
  res.status(error.status).send({ msg: error.msg });
}

function getEndpoints(req, res, next){
    res.status(200).send(endpoints)
}

module.exports = { getTopicData, getError, getEndpoints };
