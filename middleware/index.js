const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secrets = require("../config/secrets");

function restricted(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if (err) {
        //Bad Token!
        res
          .status(401)
          .json({ message: "Houston, it appears our token is bad" });
      } else {
        //The token is a good token!
        req.decodedJwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Houston, we dont have any valid tokens" });
  }
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    email: user.email,
    name: user.name
  };

  const options = {
    expiresIn: "1d"
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}

module.exports = {
  generateToken,
  restricted
};