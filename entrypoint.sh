#!/bin/bash
# entrypoint.sh
# Starts OpenClaw gateway and HTTP health check server

echo "[entrypoint] Starting OpenClaw with HTTP health check wrapper..."

# Start OpenClaw in background
node openclaw.mjs gateway --allow-unconfigured --bind lan &
OPENCLAW_PID=$!

# Wait for OpenClaw to be ready
echo "[entrypoint] Waiting for OpenClaw to start..."
sleep 5

# Start HTTP health check server on port 8080
echo "[entrypoint] Starting HTTP health check server on 0.0.0.0:8080..."
node health-check.js &
HTTP_PID=$!

# Start a background process to auto-approve pairing requests
# This ensures the first connected device gets auto-approved
echo "[entrypoint] Starting pairing auto-approver..."
node auto-approve-pairing.js &
PAIRING_PID=$!

# Wait for both processes
echo "[entrypoint] Services running (OpenClaw: $OPENCLAW_PID, HTTP: $HTTP_PID, Pairing: $PAIRING_PID)"
wait $OPENCLAW_PID
