db = require("../../data/dbConfig");

function getBy(filter) {
    return db("users").where(filter).first();
}

module.exports = {
    getBy
}