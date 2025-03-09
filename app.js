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
    // Retirer la sécurité globale pour permettre l'accès à la documentation sans authentification
    // security: [
    //   {
    //     bearerAuth: [],
    //   },
    // ],
    info: {
      title: 'Stock Management API',
      version: '1.0.0',
      description: 'API documentation for managing categories and other resources in the stock management system.',
    },
    servers: [
      {
        // url: 'http://134.122.23.150/api/v1',
        url: 'http://localhost:8000/api/v1',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./routers/*.js', './models/*.js'], // Assurez-vous que ces chemins sont corrects
};

// Middleware Swagger
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Middleware CORS & JSON
app.use(cors());
app.use(express.json());

// Routes publiques (sans authentification)
app.use('/api/v1', UserRouter);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes protégées (avec authentification)
app.use('/api/v1/categories', isLoggedIn, CategoryRouter);
app.use('/api/v1/users', isLoggedIn, UserRouter);
app.use('/api/v1/companies', isLoggedIn, CompanyRouter);
app.use('/api/v1/reports', isLoggedIn, ReportRouter);
app.use('/api/v1/stock-mouvements', isLoggedIn, StockMouvementRouter);
app.use('/api/v1/sales', isLoggedIn, SaleRouter);
app.use('/api/v1/products', isLoggedIn, ProductRouter);

module.exports = app;
