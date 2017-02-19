'use strict';

import moment from 'moment';
import * as winston from 'winston';
import config from 'winston/lib/winston/config';

let logger,
    logLevelConfig = `${process.env.NODE_ENV}_log_level` || 'log_level',
    logLevel = process.env[logLevelConfig] || 'warn',
    logFilePath = process.env.log_file_path.endsWith('/') ? process.env.log_file_path : `${process.env.log_file_path}/`,
    logFileName = process.env.log_file_name || 'filelog-warn.log',
    winstonlogTimeStampFormat = () => moment().format('YYYY/MM/DD h:mm:ss a'),
    winstonlogMessageBuilder = (options) => {
        let logContent = {
            level: options.level,
            time: options.timestamp(),
            message: undefined !== options.message ? options.message : '',
            meta: (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '')
        };

        let message = '';
        let keys = Object.keys(logContent);

        for (let i = 0; i < keys.length; i++) {
            let logContentKey = keys[i],
                logMessage = logContent[logContentKey];
            if (logMessage) {
                // if there is message then only try to log it!
                message += logContentKey + ' = ' + logMessage + ', ';
            }
        }
        return config.colorize(logContent.level, message.replace(/,\s*$/, '')); //replace last comma
    },
    setupLocalLogger = () => {
        logger = new (winston.Logger)({
            transports: [
                new winston.transports.Console({
                    level: logLevel,
                    colorize: true,
                    timestamp: winstonlogTimeStampFormat,
                    formatter: winstonlogMessageBuilder
                })
            ]
        });

        return logger;
    },
    setupNonLocalLogger = () => {
        logger = new (winston.Logger)({
            transports: [
                new winston.transports.File({
                    level: logLevel,
                    json: false, //if you don't do this formatter function is not called
                    colorize: true,
                    timestamp: winstonlogTimeStampFormat,
                    formatter: winstonlogMessageBuilder,
                    name: 'warn-file',
                    filename: `${logFilePath}${logFileName}`
                })
            ]
        });
    },
    configureLogger = () => /local/i.test(process.env.NODE_ENV) ? setupLocalLogger() : setupNonLocalLogger(),
    logMsg = (level, msg) => {
        //ignore all logs for test environment
        if (!/test/i.test(process.env.NODE_ENV)) {
            if (!logger) {
                configureLogger();
            }
            logger[level](msg);
        }
    };

export let error = (msg) => logMsg('error', msg);

export let warn = (msg) => logMsg('warn', msg);

export let info = (msg) => logMsg('info', msg);

export let verbose = (msg) => logMsg('verbose', msg);

export let debug = (msg) => logMsg('debug', msg);

export let silly = (msg) => logMsg('silly', msg);