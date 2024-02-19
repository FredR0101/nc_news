const {selectTopicData, createError} = require("../models/modelTopics")

function getTopicData(req, res, next){
    selectTopicData().then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

function getError(req, res, next){
    const error = createError()
    res.status(error.status).send({ msg: error.msg })
    }


module.exports = {getTopicData, getError}