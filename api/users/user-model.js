db = require("../../data/dbConfig");

async function add(user) {
    return db("users").insert(user)
        .then( async ([newUserID]) =>  getBy({id: newUserID}) )
}

function getBy(filter) {
    return db("users").where(filter).first();
}

module.exports = {
    getBy,
    add
}