// health-check.js
// Simple HTTP server for health checks

import http from 'http';

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Connection': 'close'
    });
    res.end(JSON.stringify({
      status: 'ok',
      gateway: 'ws://0.0.0.0:18789',
      uptime: process.uptime()
    }));
  } else {
    res.writeHead(404, { 'Connection': 'close' });
    res.end('Not Found');
  }
});

server.listen(8080, '0.0.0.0', () => {
  console.log('[health-check] HTTP server listening on 0.0.0.0:8080');
});

process.on('SIGTERM', () => {
  console.log('[health-check] Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
