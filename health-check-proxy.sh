#!/bin/bash
# health-check-proxy.sh
# Simple HTTP server that proxies to OpenClaw WebSocket and returns 200 OK for health checks

# Start OpenClaw in background
node openclaw.mjs gateway --allow-unconfigured --bind lan &
OPENCLAW_PID=$!

# Wait for OpenClaw to start
sleep 5

# Start simple HTTP server on port 8080 that returns 200
node -e "
const http = require('http');
const httpProxy = require('http-proxy');
const net = require('net');

// Simple health check server
const server = http.createServer((req, res) => {
  // Health check endpoint
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', gateway: 'ws://0.0.0.0:18789' }));
    return;
  }
  
  // WebSocket proxy
  if (req.url.startsWith('/socket') || req.url.startsWith('/__openclaw__')) {
    const proxy = httpProxy.createProxyServer({
      target: 'http://localhost:18789',
      ws: true
    });
    
    proxy.on('error', (err) => {
      console.error('Proxy error:', err);
      res.writeHead(502);
      res.end('Bad Gateway');
    });
    
    proxy.web(req, res);
    return;
  }
  
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(8080, '0.0.0.0', () => {
  console.log('Health check HTTP server listening on 0.0.0.0:8080');
});

// Keep process alive
process.on('SIGTERM', () => {
  process.exit(0);
});
" &

# Wait for both processes
wait $OPENCLAW_PID
