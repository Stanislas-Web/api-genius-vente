const express = require('express');
const app = express();
const cors = require('cors');
const UserRouter = require('./routers/user.router');
const ArticleRouter = require('./routers/article.router');
const VersionRouter = require('./routers/version.router');
const ImageRouter = require('./routers/image.router');
const OrderRouter = require('./routers/order.router');
const VersionAgentRouter = require('./routers/versionAgent.router');
const CategoryRouter = require('./routers/category.router');
const SplashRouter = require('./routers/splash.router');
const NewsRouter = require('./routers/news.router');
const OuvrageRouter = require('./routers/ouvrage.router');
const EncadreurRouter = require('./routers/encadreur.router');
const UniversiteRouter = require('./routers/universite.router');
const FaculteRouter = require('./routers/faculte.router');
const ouvrageFaculteRouter = require('./routers/ouvrageuniversite.router');


app.use(cors());
app.use(express.json());

app.use('/api/v1/', UserRouter, ArticleRouter, VersionRouter, ImageRouter, OrderRouter, VersionAgentRouter, CategoryRouter, SplashRouter, NewsRouter, OuvrageRouter, EncadreurRouter, UniversiteRouter, FaculteRouter, ouvrageFaculteRouter);

module.exports = app;