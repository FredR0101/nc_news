const {retrieveArticleDataById, retrieveAllArticleData} = require('../models/modelArticles')

function getArticleDataById(req, res, next) {
    const { article_id } = req.params
    retrieveArticleDataById(article_id).then((data) => {
    res.status(200).send({article: data})
  })
  .catch(next)
}

function getAllArticleData(req, res, next){
    retrieveAllArticleData().then((result) => {
        res.status(200).send(result)
    })
    .catch(next)
}

module.exports = { getArticleDataById, getAllArticleData };
