const {deleteComment} = require ('../models/modelComments')

function deleteCommentById(req, res, next){
    const {comment_id} = req.params
    deleteComment(comment_id).then((result) => {
        res.status(204).send({})
    })
    .catch(next)
}

module.exports = {deleteCommentById}