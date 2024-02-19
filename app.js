const express = require("express");
const app = express()
const {getTopicData} = require("./controllers/controllerTopics")

app.use(express.json())

app.get("/api/topics", getTopicData)

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    next()
})


module.exports = app;
