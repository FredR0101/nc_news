const db = require("../db/connection");

function selectTopicData() {
  return db.query(`SELECT * FROM topics`).then((result) => {
    const formattedData = result.rows.map((topic) => {
        return {
            slug: topic.slug,
            description: topic.description
        }
    })
    return formattedData
  });
}

function createError(){
    return {
        status: 404,
        msg: "Not Found"
    }
}

module.exports = {selectTopicData, createError};
