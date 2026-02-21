#!/usr/bin/env node
// health-check-server.js
// Runs OpenClaw gateway + HTTP health check server

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Start OpenClaw gateway in background
console.log('[health-check] Starting OpenClaw gateway...');
const openclaw = spawn('node', ['openclaw.mjs', 'gateway', '--allow-unconfigured', '--bind', 'lan'], {
  stdio: 'pipe',
  cwd: process.cwd()
});

// Forward OpenClaw logs
openclaw.stdout.on('data', (data) => {
  process.stdout.write(data);
});

openclaw.stderr.on('data', (data) => {
  process.stderr.write(data);
});

// Wait for OpenClaw to start, then start health check server
setTimeout(() => {
  console.log('[health-check] Starting HTTP health check server on 0.0.0.0:8080');
  
  const server = http.createServer((req, res) => {
    // Health check endpoints
    if (req.url === '/' || req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        gateway: 'ws://0.0.0.0:18789',
        timestamp: new Date().toISOString()
      }));
      return;
    }
    
    res.writeHead(404);
    res.end('Not Found');
  });
  
  server.listen(8080, '0.0.0.0', () => {
    console.log('[health-check] HTTP server listening on 0.0.0.0:8080');
  });
  
  server.on('error', (err) => {
    console.error('[health-check] HTTP server error:', err);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('[health-check] Shutting down...');
    server.close(() => {
      openclaw.kill('SIGTERM');
      process.exit(0);
    });
  });
}, 5000);

openclaw.on('exit', (code) => {
  console.log(`[health-check] OpenClaw exited with code ${code}`);
  process.exit(code);
});
