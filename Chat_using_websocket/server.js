

const express = require('express');
const WebSocket = require('ws');

// Create Express app
const app = express();

// Create HTTP server
const server = app.listen(9201, function () {
  console.log('Server started on port 9201');
});

// Create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Track connected admin and customer WebSocket clients
const clients = {
  admin: null,
  customer: null,
};

// Event listener for new WebSocket connections
wss.on('connection', function (ws, request) {
  if (request.url === '/admin') {
    // Handle admin connection
    clients.admin = ws;

    ws.on('message', function (message) {
      // Broadcast the message to the customer
      if (clients.customer && clients.customer.readyState === WebSocket.OPEN) {
        clients.customer.send(`Admin:${message}`);
      }
    });

    ws.on('close', function () {
      clients.admin = null;
    });
  } else if (request.url === '/customer') {
    // Handle customer connection
    clients.customer = ws;

    ws.on('message', function (message) {
      // Broadcast the message to the admin
      if (clients.admin && clients.admin.readyState === WebSocket.OPEN) {
        clients.admin.send(`Customer:${message}`);
      }
    });

    ws.on('close', function () {
      clients.customer = null;
    });
  }
});

// Upgrade HTTP requests to WebSocket
server.on('upgrade', function (request, socket, head) {
  if (request.url === '/admin') {
    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    });
  } else if (request.url === '/customer') {
    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    });
  } else {
    // Handle unknown URLs or other cases
    socket.destroy();
  }
});
