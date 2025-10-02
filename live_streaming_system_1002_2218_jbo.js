// 代码生成时间: 2025-10-02 22:18:42
const Hapi = require('@hapi/hapi');
const Good = require('@hapi/good');
const Hoek = require('@hapi/hoek');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Ws = require('hapi-plugin-websocket');
const Fs = require('fs');
const Path = require('path');
const Joi = require('joi');

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 3000,
    routes: {
        cors: {
            origin: ['*'],
        },
    },
});

// Register plugins
async function init() {
    await server.register([
        Inert,
        Vision,
        Good,
        await Ws,
    ]);

    // Set up WebSocket route
    server.route({
        method: 'GET',
        path: '/stream',
        handler: {
            websocket: async function (request, h) {
                const { connection } = request.raw.req;
                const ws = connection.upgradeReq;
                const wsSocket = new WebSocket(ws, wsSocket);
                
                wsSocket.on('message', function incoming(data) {
                    // Handle incoming messages from client
                    console.log('received: %s', data);
                });
                
                wsSocket.on('close', function() {
                    // Handle client disconnection
                    console.log('Client disconnected');
                });
            },
        },
        config: {
            websocket: {
                autoAcceptConnections: false,
                maxConnections: 100,
                options: {
                    keepAliveInterval: 5000,
                },
            },
        },
    });

    // Start the server
    await server.start();
    console.log('Server running at:', server.info.uri);
}

// Register a route to handle the web page for live streaming
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
        const filePath = Path.join(__dirname, 'index.html');
        return Fs.createReadStream(filePath);
    },
});

// Define the WebSocket schema for validation
const WebSocketSchema = Joi.object({
    type: Joi.string().required(),
    message: Joi.string().required(),
});

// Start the server
init().catch((err) => {
    console.error(err);
    process.exit(1);
});

// Define the HTML for the live streaming page
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Live Streaming</title>
</head>
<body>
    <h1>Live Streaming System</h1>
    <script>
        // JavaScript code to handle WebSocket connections and send/receive messages
        // This would typically be in a separate JS file, but for simplicity, it's included here.
        var ws;
        function openWebSocket() {
            ws = new WebSocket('ws://localhost:3000/stream');
            ws.onopen = function() {
                console.log('WebSocket Connected');
            };
            ws.onmessage = function(event) {
                console.log('Message from server: ', event.data);
            };
            ws.onclose = function() {
                console.log('WebSocket Disconnected');
            };
            ws.onerror = function(error) {
                console.error('WebSocket Error: ', error);
            };
        }
        function sendStreamMessage(message) {
            ws.send(JSON.stringify({ type: 'stream', message: message }));
        }
        document.addEventListener('DOMContentLoaded', function() {
            openWebSocket();
        });
    </script>
</body>
</html>
`;
