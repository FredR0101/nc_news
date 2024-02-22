const db = require("../db/connection");

function retrieveAllUserData(){
    return db.query(`SELECT * FROM users`).then((data)=> {
        return data.rows;
    })
}

module.exports = {retrieveAllUserData}