const {retrieveArticleDataById, retrieveAllArticleData, retrieveArticleComments, insertComment, updateVotes} = require('../models/modelArticles')

function getArticleDataById(req, res, next) {
    const { article_id } = req.params
    retrieveArticleDataById(article_id).then((data) => {
    res.status(200).send({article: data})
  })
  .catch(next)
}

function getAllArticleData(req, res, next){
    const {topic} = req.query
    retrieveAllArticleData(topic).then((result) => {
        res.status(200).send({articles: result})
    })
    .catch(next)
}

function getArticleCommentsById(req, res, next){
    const { article_id } = req.params
    const promises = [retrieveArticleComments(article_id)]
    if(article_id){
        promises.push(retrieveArticleDataById(article_id))
    }
    Promise.all(promises).then((promiseResolutions) => {
        res.status(200).send({article: promiseResolutions[0]})
    })
    .catch(next)
}

function postArticleCommentById(req, res, next){
    const {article_id} = req.params
    insertComment(article_id, req.body).then((result) => {
        res.status(201).send({comment: result})
    })
    .catch(next)
}

function patchArticleVotes(req, res, next){
    const {article_id} = req.params
    updateVotes(article_id, req.body.inc_votes).then((result) => {
        res.status(200).send({article: result})
    })
    .catch(next)
}
module.exports = { getArticleDataById, getAllArticleData, getArticleCommentsById, postArticleCommentById, patchArticleVotes };
