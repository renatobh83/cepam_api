require("dotenv").config();
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const verifyToken = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.URI,
  }),
  algorithms: ["RS256"],
});

module.exports = verifyToken;
