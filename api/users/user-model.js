db = require("../../data/dbConfig");

async function add(user) {
    db("users").insert(user)
        .then( ([newUserID]) => {
            return getBy({id: newUserID});
        });
}

function getBy(filter) {
    return db("users").where(filter).first();
}

module.exports = {
    getBy,
    add
}