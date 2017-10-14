if (process.env.NODE_ENV !== 'production') require('dotenv').load();
const http = require('http');
const app = require('../app');

function normalizePort(val) {
  var port = parseInt(val, 10);
  return isNaN(port) ? val : port >= 0 ? port : false;
}

function onListen() {
  console.log(`Listening on port ${port}`);
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
}

function onError(err) {
  if (err.syscall !== 'listen') throw err;

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (err.code) {
    case 'EACCESS':
      console.log(`${bind} requires elevated privilege`);
      break;
    case 'EADDRINUSE':
      console.log(`${bind} is already in use`);
      break;
    default:
      throw err;
  }
}

const port = normalizePort(process.env.PORT || 8000);
const server = http.createServer(app);

server.on('listening', onListen);
server.on('error', onError);
server.listen(port);
