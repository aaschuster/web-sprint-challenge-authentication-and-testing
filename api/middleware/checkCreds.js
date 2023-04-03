
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
    next();
}

function usernameExists(req, res, next) {
    next();
}

module.exports = {
    checkUserAndPass,
    usernameNotTaken,
    usernameExists
}