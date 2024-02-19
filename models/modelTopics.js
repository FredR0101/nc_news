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

module.exports = {selectTopicData};
