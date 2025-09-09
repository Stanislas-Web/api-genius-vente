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
const VersionRouter = require('./routers/version.router');
const ClassroomRouter = require('./routers/classroom.router');
const StudentRouter = require('./routers/student.router');
const TeacherRouter = require('./routers/teacher.router');
const SchoolFeeRouter = require('./routers/schoolFee.router');
const PaymentRouter = require('./routers/payment.router');
const SectionRouter = require('./routers/section.router');
const OptionRouter = require('./routers/option.router');
const { isLoggedIn, companyContext } = require('./middleware');
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
      title: 'Genius vente API',
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
  origin: ['https://www.geniusvente.com','http://localhost:5171', 'http://localhost:5172', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'  ],
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

// Routes publiques pour les versions (sans authentification)
app.get('/api/v1/versions', require('./controllers/version.controller').getAllVersions);
app.get('/api/v1/versions/latest', require('./controllers/version.controller').getLatestVersion);
app.get('/api/v1/versions/:id', require('./controllers/version.controller').getVersionById);

// Routes protégées (avec authentification)
app.use('/api/v1/categories', isLoggedIn, CategoryRouter);
app.use('/api/v1/users', isLoggedIn, UserRouter);
app.use('/api/v1/companies', isLoggedIn, CompanyRouter);
app.use('/api/v1/reports', isLoggedIn, ReportRouter);
app.use('/api/v1/stock-mouvements', isLoggedIn, StockMouvementRouter);
app.use('/api/v1/sales', isLoggedIn, SaleRouter);
app.use('/api/v1/products', isLoggedIn, ProductRouter);
app.use('/api/v1', isLoggedIn, VersionRouter);

// Routes protégées avec contexte multi-tenant (système scolaire)
app.use('/api/v1/classrooms', isLoggedIn, companyContext, ClassroomRouter);
app.use('/api/v1/students', isLoggedIn, companyContext, StudentRouter);
app.use('/api/v1/teachers', isLoggedIn, companyContext, TeacherRouter);
app.use('/api/v1/school-fees', isLoggedIn, companyContext, SchoolFeeRouter);
app.use('/api/v1/payments', isLoggedIn, companyContext, PaymentRouter);
app.use('/api/v1/sections', isLoggedIn, companyContext, SectionRouter);
app.use('/api/v1/options', isLoggedIn, companyContext, OptionRouter);

module.exports = app;