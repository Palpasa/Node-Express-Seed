'use strict';


let exp = {},
    errorLogger = require('debug')('error'),
    lairApp,
    env;

// catch 404 and forward to error handler
let handle404 = function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
};

let handleAllErrors = function (err, req, res, next) {
    if (err.app === 'LAIR') {
        handleLairErrors(err, res);
    } else {
        handleUnexpectedErrors(err, req, res)
    }
};

//error handler. Stack trace is set only in development
let handleUnexpectedErrors = function (err, req, res) {
    let error = {};
    error.status = err.status || 500;
    error.description = err.description || (err.status === 404 ? 'Not found' :'Unexpected error occurred');
    error.message = err.message;
    error.err = err;

    errorLogger(JSON.stringify(error));

    //we logged everything! Now update here not to leak strack trace in production
    error.err = env === 'development' ? err : '';

    res.status(error.status).json(error);

};

// All error object that we throw will have type and app set to it.
let handleLairErrors = (err, res) => {
    let statusCode = 500 || err.status, msg = err.message;
    switch (err.type) {

        case 'NO_DATA_TO_UPDATE_PROFILE':
        case 'PASSWORD_REQUIREMENTS_NOT_MET':
        case 'LOGIN_UPDATE_INVALID_ACTION':
        case 'PROFILE_VERIFICATION_ERROR':
        case 'ALREADY_IN_VERIFIED_RELN':
        case 'USER_ALREADY_SENT_REQUEST':
        case 'DUPLICATE_RELN_REQUEST':
        case 'INSUFFICIENT_LOGIN_DATA':
        case 'LOGIN_UPDATE_SAME_PASSWORD':
            statusCode = 400;
            break;

        case 'VALIDATION_ERROR':
            statusCode = 400;
            let errors = err.errors;
            let errorResponse = {};
            Object.keys(errors).forEach((field) => {
                errorResponse[field] = errors[field].message;
            });
            msg = errorResponse;
            break;

        case 'ITEM_NOT_FOUND':
        case 'NO_PROFILE_TO_UPDATE':
            statusCode = 404;
            break;

       case 'PASSWORD_ENCRYPTION_FAILED':
            statusCode = 500;
            msg = 'Something wrong with the password. Try new one!';
            break;

        default:
            msg = 'We know about this error but no specific message exists. Actual error message is: ' + msg;
            break;
    }

    res.status(statusCode).json({'message': msg});
};

exp.initErrorHandler = (app) => {
    lairApp = app;
    lairApp.use(handle404);
    lairApp.use(handleAllErrors);
    env = process.env.NODE_ENV;
    errorLogger('Current environment is ' + env);
};

module.exports = exp;

