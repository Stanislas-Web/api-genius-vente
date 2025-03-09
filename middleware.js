// loading env variables
const jwt = require("jsonwebtoken");

// MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
const isLoggedIn = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({ error: "pas d'authorization header" });
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ error: "header authentification mal formater" });
    }

    const payload = jwt.decode(token);
    if (!payload) {
      return res.status(400).json({ error: "token verification failed" });
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(400).json({ error });
  }
};

// export custom middleware
module.exports = {
  isLoggedIn
};