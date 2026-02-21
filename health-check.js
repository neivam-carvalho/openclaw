// health-check.js
// HTTP server for health checks + Canvas UI static files + WebSocket proxy to gateway

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// MIME types for common file extensions
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/icon',
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

function serveControlUI(req, res) {
  let filePath = path.join(__dirname, 'dist', 'control-ui', req.url === '/' ? 'index.html' : req.url);
  
  // Normalize path to prevent directory traversal
  const normalized = path.normalize(filePath);
  const uiDir = path.normalize(path.join(__dirname, 'dist', 'control-ui'));
  if (!normalized.startsWith(uiDir)) {
    return serveFallback(req, res, 403);
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // For routes like /chat, /overview etc, serve index.html (SPA routing)
    if (path.extname(filePath) === '') {
      filePath = path.join(uiDir, 'index.html');
      if (!fs.existsSync(filePath)) {
        return serveFallback(req, res, 404);
      }
    } else {
      return serveFallback(req, res, 404);
    }
  }

  // Serve the file
  try {
    const content = fs.readFileSync(filePath);
    const mimeType = getMimeType(filePath);
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);
  } catch (err) {
    console.error(`[health-check] Error serving ${filePath}:`, err.message);
    serveFallback(req, res, 500);
  }
}

function serveFallback(req, res, status = 404) {
  const statusMessages = {
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
  };
  res.writeHead(status, { 'Content-Type': 'text/plain' });
  res.end(statusMessages[status] || 'Error');
}

function serveHealth(req, res) {
  // Detect if coming from HTTPS proxy
  const isSecure = req.headers['x-forwarded-proto'] === 'https';
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ok',
    gateway: 'ws://127.0.0.1:18789',
    uptime: process.uptime(),
    secure: isSecure
  }));
}

const server = http.createServer((req, res) => {
  // Security headers
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Connection', 'close');
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // Health check endpoints
  if (url.pathname === '/' && req.method === 'GET' && url.search === '') {
    // Root without query string = serve Canvas UI
    serveControlUI(req, res);
  } else if (url.pathname === '/health') {
    serveHealth(req, res);
  } else if (req.method === 'GET') {
    // Try to serve from control-ui
    serveControlUI(req, res);
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});

// WebSocket upgrade handler for proxying to the gateway
server.on('upgrade', (req, socket, head) => {
  console.log(`[ws-proxy] Upgrade request: ${req.url}`);
  
  const targetUrl = `ws://127.0.0.1:18789${req.url}`;
  
  try {
    const gatewayWs = new WebSocket(targetUrl, {
      headers: {
        'x-forwarded-for': req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        'x-forwarded-proto': req.headers['x-forwarded-proto'] || 'http',
        'x-forwarded-host': req.headers['x-forwarded-host'] || req.headers['host'],
      },
    });

    gatewayWs.on('open', () => {
      console.log(`[ws-proxy] Connected to gateway for ${req.url}`);
      const clientWs = new WebSocket.Server({ noServer: true });
      clientWs.handleUpgrade(req, socket, head, (ws) => {
        // Proxy client → gateway
        ws.on('message', (msg) => {
          if (gatewayWs.readyState === WebSocket.OPEN) {
            gatewayWs.send(msg);
          }
        });

        ws.on('close', () => {
          console.log(`[ws-proxy] Client disconnected`);
          gatewayWs.close();
        });

        ws.on('error', (err) => {
          console.error(`[ws-proxy] Client error:`, err.message);
          gatewayWs.close();
        });

        // Proxy gateway → client
        gatewayWs.on('message', (msg) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(msg);
          }
        });

        gatewayWs.on('close', () => {
          console.log(`[ws-proxy] Gateway disconnected`);
          ws.close();
        });

        gatewayWs.on('error', (err) => {
          console.error(`[ws-proxy] Gateway error:`, err.message);
          ws.close();
        });
      });
    });

    gatewayWs.on('error', (err) => {
      console.error(`[ws-proxy] Failed to connect to gateway:`, err.message);
      socket.write('HTTP/1.1 502 Bad Gateway\r\n\r\n');
      socket.destroy();
    });
  } catch (err) {
    console.error(`[ws-proxy] Proxy error:`, err.message);
    socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n');
    socket.destroy();
  }
});

server.listen(8080, '0.0.0.0', () => {
  console.log('[health-check] HTTP server listening on 0.0.0.0:8080');
  console.log('[health-check] - Serving Canvas UI from dist/control-ui/');
  console.log('[health-check] - Proxying WebSocket to gateway at ws://127.0.0.1:18789');
});

process.on('SIGTERM', () => {
  console.log('[health-check] Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
