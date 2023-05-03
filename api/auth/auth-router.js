const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require('express').Router();

const { JWT_SECRET } = require("../secrets");
const {
  checkUserAndPass,
  usernameNotTaken,
  usernameExists
} = require("../middleware/checkCreds");
const Users = require("../users/user-model");

router.post('/register', checkUserAndPass, usernameNotTaken, (req, res, next) => {
  let user = req.body;

  user.password = bcrypt.hashSync(user.password, 8);

  Users.add(user)
    .then( newUser => res.status(201).json(newUser))
    .catch(next);
});

function buildToken(user) {
  return jwt.sign(
    {
      subject: user.id,
      username: user.username
    },
    JWT_SECRET,
    {
      expiresIn: "1d"
    }
  )
}

router.post('/login', checkUserAndPass, usernameExists, (req, res, next) => {
  let { username, password } = req.body;

  Users.getBy({username})
    .then( user => {
      if(bcrypt.compareSync(password, user.password)) return res.json({
          message: `welcome, ${username}`,
          token: buildToken(user)
        })
      else next({
        status: 401,
        message: "invalid credentials"
      })
    })
    .catch(next);
});

module.exports = router;
