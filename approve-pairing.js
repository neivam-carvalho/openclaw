#!/usr/bin/env node

/**
 * Script para aprovar pairing requests do OpenClaw Gateway
 * Uso: node approve-pairing.js <gateway-url> <gateway-token>
 * 
 * Exemplo:
 *   node approve-pairing.js https://openclaw.upvya.com 472eb1f41e0ae34a224eed25068364cfef4d083d839add95a9927bc422f9b5d7
 */

import WebSocket from 'ws';

const args = process.argv.slice(2);
const gatewayUrl = args[0] || 'wss://openclaw.upvya.com';
const gatewayToken = args[1] || process.env.OPENCLAW_GATEWAY_TOKEN;

if (!gatewayToken) {
  console.error('❌ Gateway token não fornecido!');
  console.error('Uso: node approve-pairing.js <gateway-url> <gateway-token>');
  console.error('Ou defina OPENCLAW_GATEWAY_TOKEN como variável de ambiente');
  process.exit(1);
}

// Converter HTTPS para WSS
const wsUrl = gatewayUrl
  .replace(/^https:\/\//, 'wss://')
  .replace(/^http:\/\//, 'ws://')
  .replace(/\/$/, '');

console.log(`🔗 Conectando ao gateway: ${wsUrl}`);

const ws = new WebSocket(wsUrl, {
  rejectUnauthorized: false // Accept self-signed certs
});
let requestCounter = 1;

const makeRequest = (ws, method, params = {}) => {
  return new Promise((resolve, reject) => {
    const id = String(requestCounter++);
    
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout aguardando resposta para ${method}`));
    }, 10000);

    const onMessage = (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'res' && msg.id === id) {
          clearTimeout(timeout);
          ws.off('message', onMessage);
          resolve(msg);
        }
      } catch (e) {
        // ignore parse errors
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

async function run() {
  try {
    await new Promise(resolve => ws.once('open', resolve));
    console.log('✅ Conectado ao gateway\n');

    // Step 1: Connect com o token
    console.log('📋 Enviando handshake de conexão...');
    const connectRes = await makeRequest(ws, 'connect', {
      minProtocol: 1,
      maxProtocol: 1,
      client: {
        id: 'pairing-manager',
        version: '1.0.0',
        platform: 'cli',
        mode: 'admin'
      },
      auth: { token: gatewayToken }
    });

    if (!connectRes.ok) {
      console.error('❌ Falha na conexão:', connectRes.error?.message);
      process.exit(1);
    }
    console.log('✅ Conectado com sucesso\n');

    // Step 2: List pairing requests
    console.log('📊 Listando pedidos de pairing pendentes...');
    const listRes = await makeRequest(ws, 'device.pair.list', {});
    
    if (!listRes.ok) {
      console.error('❌ Erro ao listar pairing requests:', listRes.error?.message);
      process.exit(1);
    }

    const pending = listRes.payload?.pending || [];
    console.log(`Found ${pending.length} pending pairing request(s)\n`);

    if (pending.length === 0) {
      console.log('✅ Nenhum pedido de pairing pendente');
      ws.close();
      return;
    }

    // Step 3: Approve all pending requests
    for (const request of pending) {
      console.log(`⏳ Aprovando pairing: ${request.requestId}`);
      console.log(`   Device ID: ${request.device.deviceId}`);
      console.log(`   Role: ${request.device.role || 'N/A'}`);

      const approveRes = await makeRequest(ws, 'device.pair.approve', {
        requestId: request.requestId
      });

      if (!approveRes.ok) {
        console.error(`   ❌ Erro ao aprovar:`, approveRes.error?.message);
        continue;
      }

      console.log(`   ✅ Aprovado com sucesso\n`);
    }

    console.log('✨ Todos os pedidos foram processados!');
    console.log('Agora você pode recarregar a UI para conectar.');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    ws.close();
  }
}

run().catch(console.error);
