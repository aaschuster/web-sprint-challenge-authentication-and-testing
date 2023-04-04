const Users = require("../users/user-model");

function checkUserAndPass(req, res, next) {
    if(req.body.username && req.body.password) {
        req.body.username = req.body.username.trim();
        if(req.body.username) return next();
    }

    next({
        status: 422,
        message: "username and password required"
    });
}

function usernameNotTaken(req, res, next) {
    Users.getBy({username: req.body.username})
        .then( user => {
            if(user) return next({
                status: 422,
                message: "username taken"
            })
            next();
        })
        .catch(next);
}

function usernameExists(req, res, next) {
    Users.getBy({username: req.body.username})
        .then( user => {
            if(user) return next();
            return next({
                status: 401,
                message: "invalid credentials"
            });
        })
}

module.exports = {
    checkUserAndPass,
    usernameNotTaken,
    usernameExists
}