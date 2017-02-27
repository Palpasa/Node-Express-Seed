'use strict';

import * as logger from './logger';

let env = process.env.NODE_ENV;

let exp = {};

// catch 404 and forward to error handler
let handle404 = function (req, res, next) {
    let error = new Error('Item not found');
    error.status = 404;
    next(error);
};

//error handler. Stack trace is set only in development
let handleUnexpectedErrors = function (err, req, res) {

    logger.error(err);
    let error = {
        status: err.status || 500,
        message: err.message || 'Unexpected error occurred',
    };

    res.status(error.status).end(error.message);
};


export let initErrorHandler = (app) => {
    app.use(handle404);
    app.use(handleUnexpectedErrors);
};

