#!/usr/bin/env node

/**
 * Auto-Approve Pairing Requests
 * Automatically approves pairing requests from connecting devices
 * This ensures first-time UI connections work without manual intervention
 */

import WebSocket from 'ws';

const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';
const GATEWAY_LOOPBACK = 'ws://127.0.0.1:18789';
const POLL_INTERVAL_MS = 2000;

if (!GATEWAY_TOKEN) {
  console.error('[pairing-auto] ❌ OPENCLAW_GATEWAY_TOKEN not set, cannot auto-approve pairing');
  process.exit(1);
}

console.log('[pairing-auto] ✨ Starting auto-approval monitor...');

let requestCounter = 1;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const makeRequest = (ws, method, params = {}) => {
  return new Promise((resolve, reject) => {
    const id = String(requestCounter++);
    
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout: ${method}`));
    }, 5000);

    const onMessage = (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'res' && msg.id === id) {
          clearTimeout(timeout);
          ws.off('message', onMessage);
          resolve(msg);
        }
      } catch (e) {
        // ignore
      }
    };

    ws.on('message', onMessage);

    ws.send(JSON.stringify({
      type: 'req',
      id,
      method,
      params
    }));
  });
};

async function connectToGateway() {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(GATEWAY_LOOPBACK);
    
    ws.once('open', async () => {
      try {
        // Connect with token
        const connectRes = await makeRequest(ws, 'connect', {
          minProtocol: 1,
          maxProtocol: 1,
          client: {
            id: 'openclaw-control-ui',
            version: '1.0.0',
            platform: 'web',
            mode: 'webchat'
          },
          auth: { token: GATEWAY_TOKEN }
        });

        if (!connectRes.ok) {
          reject(new Error(`Connect failed: ${connectRes.error?.message}`));
          return;
        }

        resolve(ws);
      } catch (err) {
        reject(err);
      }
    });

    ws.once('error', reject);
  });
}

async function checkAndApprovePairing(ws) {
  try {
    // List pending pairing requests
    const listRes = await makeRequest(ws, 'device.pair.list', {});
    
    if (!listRes.ok) {
      return;
    }

    const pending = listRes.payload?.pending || [];
    
    for (const request of pending) {
      console.log(`[pairing-auto] 📱 Found pending request: ${request.requestId}`);
      console.log(`[pairing-auto]    Device: ${request.device.deviceId}`);

      try {
        const approveRes = await makeRequest(ws, 'device.pair.approve', {
          requestId: request.requestId
        });

        if (approveRes.ok) {
          console.log(`[pairing-auto] ✅ Auto-approved: ${request.requestId}`);
        } else {
          console.log(`[pairing-auto] ❌ Failed to approve: ${approveRes.error?.message}`);
        }
      } catch (err) {
        console.error(`[pairing-auto] ⚠️  Error approving: ${err.message}`);
      }
    }
  } catch (err) {
    console.error(`[pairing-auto] ⚠️  Error listing pairing: ${err.message}`);
  }
}

async function monitorPairing() {
  let ws = null;
  let reconnectDelay = 5000;

  while (true) {
    try {
      // Establish connection
      if (!ws) {
        console.log('[pairing-auto] 🔗 Connecting to gateway...');
        ws = await connectToGateway();
        reconnectDelay = 5000; // Reset on successful connection
        console.log('[pairing-auto] ✅ Connected');
      }

      // Check for pending pairing requests
      await checkAndApprovePairing(ws);

      // Wait before next check
      await delay(POLL_INTERVAL_MS);

    } catch (err) {
      console.error(`[pairing-auto] ⚠️  ${err.message}`);
      
      // Close existing connection
      if (ws) {
        ws.close();
        ws = null;
      }

      // Wait before reconnecting with exponential backoff
      console.log(`[pairing-auto] ⏳ Reconnecting in ${reconnectDelay}ms...`);
      await delay(reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay * 1.5, 30000);
    }
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('[pairing-auto] 👋 Shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[pairing-auto] 👋 Shutting down...');
  process.exit(0);
});

// Start monitoring
monitorPairing().catch(err => {
  console.error('[pairing-auto] Fatal error:', err);
  process.exit(1);
});
