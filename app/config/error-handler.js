'use strict';

import * as logger from './logger';

let env = process.env.NODE_ENV;

let exp = {},
    expressApp;

// catch 404 and forward to error handler
let handle404 = function (req, res, next) {
    console.log('--> Handling 404 errors');
    let error = new Error('Item not found');
    error.status = 404;
    next(error);
};

//error handler. Stack trace is set only in development
let handleUnexpectedErrors = function (err, req, res) {
    console.log('--> Handling unexpected errors');
    let error = {
        status: err.status || 500,
        message: err.message || 'Unexpected error occurred',
        err: err.status === 404 ? {}: err
    };
    // error.status = err.status || 500;
    // error.description = err.description || (err.status === 404 ? 'Not found' :'Unexpected error occurred');
    // error.message = err.message;
    // error.err = err;

    logger.error(error);

    //we logged everything! Now update here not to leak strack trace in production
    error.err = (/local/i.test(env) || /development/i.test(env)) ? err : {};

    res.status(error.status).json(error);
};


exp.initErrorHandler = (app) => {
    app.use(handle404);
    app.use(handleUnexpectedErrors);
};

module.exports = exp;

