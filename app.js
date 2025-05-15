const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const CategoryRouter = require('./routers/category.router');
const UserRouter = require('./routers/user.router');
const CompanyRouter = require('./routers/company.router');
const ReportRouter = require('./routers/report.router');
const StockMouvementRouter = require('./routers/stockMouvement.router');
const SaleRouter = require('./routers/sale.router');
const ProductRouter = require('./routers/product.router');
const { isLoggedIn } = require('./middleware');
const { createCompany } = require('./controllers/company.controller');
const { generateSalesSummaryByPhone } = require('./controllers/report.controller');

const app = express();

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    info: {
      title: 'Stock Management API',
      version: '1.0.0',
      description: 'API documentation for managing categories and other resources in the stock management system.',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Serveur de développement',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routers/*.js', './models/*.js'],
};

// Middleware Swagger
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Middleware CORS & JSON
app.use(cors({
  origin: ['https://www.geniusvente.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version', 'Authorization']
}));
app.use(express.json());

// Route spécifique pour le login
app.post('/api/v1/login', require('./controllers/user.controller').login);
app.post('/api/v1/signup', require('./controllers/user.controller').signUp);

// Routes publiques (sans authentification)
app.use('/api/v1/auth', UserRouter);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Route GET des catégories (sans authentification)
app.get('/api/v1/categories', require('./controllers/category.controller').getAllCategories);

// Route POST pour la création de compagnie (sans authentification)
app.post('/api/v1/companies', createCompany);

// Route POST pour le résumé des ventes par téléphone (sans authentification)
app.post('/api/v1/sales-summary-by-phone', generateSalesSummaryByPhone);

// Routes protégées (avec authentification)
app.use('/api/v1/categories', isLoggedIn, CategoryRouter);
app.use('/api/v1/users', isLoggedIn, UserRouter);
app.use('/api/v1/companies', isLoggedIn, CompanyRouter);
app.use('/api/v1/reports', isLoggedIn, ReportRouter);
app.use('/api/v1/stock-mouvements', isLoggedIn, StockMouvementRouter);
app.use('/api/v1/sales', isLoggedIn, SaleRouter);
app.use('/api/v1/products', isLoggedIn, ProductRouter);

module.exports = app;