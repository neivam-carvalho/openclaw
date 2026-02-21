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

# Wait for both processes
echo "[entrypoint] Services running (OpenClaw: $OPENCLAW_PID, HTTP: $HTTP_PID)"
wait $OPENCLAW_PID
