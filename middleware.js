// loading env variables
const jwt = require("jsonwebtoken");

// MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
const isLoggedIn = async (req, res, next) => {
  try {
    // Autoriser l'accès sans token pour les endpoints sales-summary-by-phone et send-sales-summary-to-whatsapp
    if (req.originalUrl === '/api/v1/sales-summary-by-phone' || 
        req.originalUrl === '/api/v1/reports/sales-summary-by-phone' ||
        req.originalUrl === '/api/v1/reports/send-sales-summary-to-whatsapp' ||
        req.originalUrl === '/api/v1/reports/send-simple-text-message' ||
        req.originalUrl === '/api/v1/reports/mock-whatsapp-message') {
      return next();
    }

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