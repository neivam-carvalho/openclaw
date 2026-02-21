#!/bin/bash
# entrypoint.sh
# Starts OpenClaw gateway and HTTP health check server

set -e

echo "[entrypoint] Starting OpenClaw with HTTP health check wrapper..."

# Start OpenClaw in background
node openclaw.mjs gateway --allow-unconfigured --bind lan &
OPENCLAW_PID=$!

# Wait for OpenClaw to be ready
echo "[entrypoint] Waiting for OpenClaw to start..."
sleep 5

# Start HTTP health check server on port 8080
echo "[entrypoint] Starting HTTP health check server on 0.0.0.0:8080..."
node << 'EOF'
const http = require('http');

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
EOF &
HTTP_PID=$!

# Wait for both processes
echo "[entrypoint] Services running (OpenClaw: $OPENCLAW_PID, HTTP: $HTTP_PID)"
wait $OPENCLAW_PID
