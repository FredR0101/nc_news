const {retrieveAllUserData} = require("../models/modelUsers")

function getAllUsers(req, res, next){
    retrieveAllUserData().then((result) => {
       res.status(200).send({users: result}) 
    })
    .catch(next)
}

module.exports = {getAllUsers}