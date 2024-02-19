const db = require("../db/connection");

function selectTopicData() {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result
  });
}

function createError(){
    return {
        status: 404,
        msg: "Not Found"
    }
}

module.exports = {selectTopicData, createError};
