function arrayCommentData(data, value1, value2) {
  if (Object.keys(data).length < 2 || Object.keys(data).length > 2) {
    return [];
  } else {
    return [data[value1], data[value2]];
  }
}

function retrieveUserNames(data, value1){
    return data.map((user)=> {
        return user[value1]
    })
}

module.exports = { arrayCommentData, retrieveUserNames };
