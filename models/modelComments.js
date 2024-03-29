const db = require("../db/connection");
const users = require("../db/data/test-data/users");

function deleteComment(comment_id) {
  if (comment_id) {
    return db.query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id]).then((result) => {
        if(result.rowCount === 0){
            return Promise.reject({
                status: 404,
                msg: "Comment not found",
              });
        }
    })
  }
}

module.exports = { deleteComment };
