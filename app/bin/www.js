#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */

import '../config/settings-loader';
import app from '../app';
import http from 'http';
import * as logger from '../config/logger';

/**
 * Normalize a port into a number, string, or false.
 */

let normalizePort = (val) => {

  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

let onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

let onListening = () => {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger.silly(`App started on port ${bind}`);
}

/**
 * Get port from environment and store in Express.
 */

let envBasedPortProperty = `${process.env.NODE_ENV}_port`,
  port = normalizePort(process.env.port || process.env[envBasedPortProperty] || '3000'),
  server = http.createServer(app);

app.set('port', port);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);