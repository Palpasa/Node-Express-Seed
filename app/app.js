'use strict';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import faviocn from 'serve-favicon';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import appRouter from './router';
import errorHandler from './config/error-handler';
import db from './config/db'

let app = express();

//http://expressjs.com/en/advanced/best-practice-security.html
app.use(helmet());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//TODO fix CORS header
app.use(function(req, res, next) {
    if (req.method === 'OPTIONS') {
        var headers = {};
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();

    }else {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }
});


//router
appRouter.init(app);

// error handler
errorHandler.initErrorHandler(app);

module.exports = app;