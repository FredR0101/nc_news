const express = require("express");
const app = express()
const {getTopicData, getError, getEndpoints} = require("./controllers/controllerTopics")

app.get("/api/topics", getTopicData)

app.get("/api", getEndpoints)

app.get("/api/*", getError)

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    next()
})


module.exports = app;
