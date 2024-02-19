const {selectTopicData} = require("../models/modelTopics")

function getTopicData(req, res, next){
    selectTopicData().then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}



module.exports = {getTopicData}