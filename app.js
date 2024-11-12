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
    security: [
      {
        bearerAuth: [],
      },
    ],
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




app.use('/api/v1/', CategoryRouter, UserRouter, CompanyRouter, ReportRouter, StockMouvementRouter, SaleRouter);

// Middleware Swagger Docs
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

module.exports = app;
